import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { FC } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

const Login: FC = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      console.log(values);
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);

        toast.success("Login successful");
        navigate("/")
      } catch (error: any) {
        toast.error(error.message.split(':')[1]);
        setFieldError("email", "Invalid email or password");
        setFieldError("password", "Invalid email or password");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              //   backgroundColor: "red",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                autoComplete="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error = {(formik.touched.email && formik.errors.email) ? true : false}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={formik.touched.password && formik.errors.password ? true : false}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Logging in" : "Sign In"}
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default Login;
