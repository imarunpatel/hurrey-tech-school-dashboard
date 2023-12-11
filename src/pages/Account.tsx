import {
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { auth, firestore } from "../../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateProfile, updateUser } from "../store/userSlice";
import { RootState } from "../store/store";
import EditIcon from "@mui/icons-material/Edit";
import User from "../assets/user.png";
import { uploadImage } from "../utils/uploadImage";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  phone: yup.string().required("Phone is required").min(10).max(10),
  username: yup
    .string()
    .required("Username is required")
    .matches(/^[a-zA-Z][a-zA-Z0-9.-_-]{2,28}[a-zA-Z0-9]$/, "Invalid username"),
});

const Account: React.FC = () => {
  const dispatch = useAppDispatch();
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState(false);
  const user = useAppSelector((state: RootState) => state.user).user;
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      username: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const user = auth.currentUser;
      if (user !== null) {
        try {
          let data = {
            name: values.name,
            phone: +values.phone!,
            username: values.username,
            updatedAt: new Date().toISOString(),
          };

          const docRef = doc(firestore, "users", user.uid);
          await setDoc(docRef, data, { merge: true });
          dispatch(updateUser({ ...data, email: user.email! }));
          formik.resetForm();
          setEdit(false);
          toast.success("Profile details updated successfully!");
        } catch (e: any) {
          toast.error(e.message || "Something went wrong");
        } finally {
          setSubmitting(false);
        }
      }
    },
  });

  const handleEdit = () => {
    if (user) {
      formik.setValues({
        name: user.name,
        phone: user.phone.toString(),
        username: user.username,
      });
      setEdit(true);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let tempImage = e.target.files![0];
    if (!tempImage || !tempImage.type.startsWith("image/")) return;

    try {
      setLoading(true);
      let imageUrl = await uploadImage(tempImage);
      dispatch(updateProfile(imageUrl!));
      toast.success("Profile updated successfully!")
    } catch (e: any) {
      toast.error(e.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h1" sx={{ letterSpacing: 1, fontWeight: "200" }}>
        Account
      </Typography>
      <Box
        sx={{
          textAlign: "end",
          mb: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          p: 3,
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          badgeContent={
            loading ? (
              <CircularProgress color="secondary" size={30} />
            ) : (
              <IconButton
                style={{
                  backgroundColor: "skyblue",
                }}
                size="small"
                onClick={() => {
                  imagePickerRef.current?.click();
                }}
              >
                <EditIcon />
                <input
                  ref={imagePickerRef}
                  type="file"
                  hidden
                  onChange={(e) => {
                    handleImageUpload(e);
                  }}
                />
              </IconButton>
            )
          }
        >
          <Avatar
            alt={user?.name}
            src={user?.imgUrl ? user?.imgUrl : User}
            sx={{ width: 110, height: 110 }}
          />
        </Badge>

        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <form onSubmit={formik.handleSubmit}>
            {edit ? (
              <Box>
                {/* Name Field */}
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Name"
                  variant="outlined"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  margin="normal"
                />

                {/* Phone Field */}
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone"
                  type="number"
                  variant="outlined"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  margin="normal"
                />

                {/* Username Field */}
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  variant="outlined"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                  margin="normal"
                />
              </Box>
            ) : (
              <List>
                <ListItem sx={styles.listItem}>
                  <div>Name</div>
                  <div>{user?.name}</div>
                </ListItem>
                <ListItem sx={styles.listItem}>
                  <div>Email</div>
                  <div>{user?.email}</div>
                </ListItem>
                <ListItem sx={styles.listItem}>
                  <div>Phone</div>
                  <div>{user?.phone}</div>
                </ListItem>
                <ListItem sx={styles.listItem}>
                  <div>Username</div>
                  <div>{user?.username}</div>
                </ListItem>
              </List>
            )}

            {/* Submit Button */}
            {!edit ? (
              <Box>
                <Button variant="outlined" onClick={handleEdit}>
                  Edit
                </Button>
              </Box>
            ) : (
              <Box>
                {!formik.isSubmitting ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setEdit(false)}
                  >
                    Cancel
                  </Button>
                ) : null}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ ml: "9px" }}
                  disabled={formik.isSubmitting}
                >
                  Submit
                </Button>
              </Box>
            )}
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Account;

const styles = {
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid gray",
  },
};
