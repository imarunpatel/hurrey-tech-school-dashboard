import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { ISchool } from "../models/school";
import { useAppDispatch } from "../store/hooks";
import { addNewSchool } from "../store/schoolSlice";
import { APIService } from "../services/apiService";
import { toast } from "react-toastify";

type SchoolFormErrors = {
  [K in keyof ISchool]?: string;
};

interface Props {
  open: boolean;
  handleClose: () => void;
}
const initialFormData = {
  name: "",
  medium: "",
  board: "",
  class: 0,
};
const AddSchool: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<SchoolFormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const validateForm = () => {
    const newErrors: any = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (value === "" || value === null) {
        newErrors[key] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      addSchool();
    } else {
      // console.log("Form has errors");
    }
  };

  const addSchool = async () => {
    const data: Omit<ISchool, "$id"> = {
      name: formData.name,
      medium: formData.medium,
      board: formData.board,
      class: formData.class,
      createdAt: new Date().toISOString(),
    };
    setLoading(true);
    try {
      const docRef = await APIService.addSchool(data);
      const newData: ISchool = {
        $id: docRef.id,
        ...data,
      };
      toast.success('School added successfully!')
      dispatch(addNewSchool(newData));
      props.handleClose();
    } catch (e: any) {
      toast.error(e.message || "Something weng wrong")
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add School</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            variant="standard"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Medium"
            variant="standard"
            name="medium"
            value={formData.medium}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.medium}
            helperText={errors.medium}
          />
          <TextField
            label="Board"
            variant="standard"
            name="board"
            value={formData.board}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.board}
            helperText={errors.board}
          />
          <TextField
            label="Class"
            variant="standard"
            name="class"
            type="number"
            value={formData.class}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.class}
            helperText={errors.class}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          {loading ? <Button type="submit" variant="contained" disabled>
            Loaing..
          </Button> :
          <Button type="submit" onClick={handleSubmit} variant="contained">
            Submit
          </Button>}
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default AddSchool;
