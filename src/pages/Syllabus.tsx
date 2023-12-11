import React from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import {
  CancelOutlined,
  PlusOneOutlined,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { APIService } from "../services/apiService";
import { toast } from "react-toastify";
import * as yup from "yup";

const initialValues = {
  board: "",
  class: "",
  subject: "",
  academic_year: "",
  syllabus_description: "",
  topics: [
    {
      title: "",
      description: "",
      subtopics: [
        {
          title: "",
          description: "",
        },
      ],
    },
  ],
};

const validationSchema = yup.object({
  board: yup.string().required("Board is required"),
  class: yup.string().required("Class is required"),
  subject: yup.string().required("Subject is required"),
  academic_year: yup.string().required("Academic year is required"),
  syllabus_description: yup
    .string()
    .required("Syllabus description is required"),
  topics: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Topic title is required"),
      description: yup.string().required("Topic description is required"),
      subtopics: yup.array().of(
        yup.object().shape({
          title: yup.string().required("Subtopic title is required"),
          description: yup
            .string()
            .required("Subtopic description is required"),
        })
      ),
    })
  ),
});

const Syllabus: React.FC = () => {
  const addTopic = () => {
    formik.setFieldValue("topics", [
      ...formik.values.topics,
      {
        title: "",
        description: "",
        subtopics: [{ title: "", description: "" }],
      },
    ]);
  };

  const removeTopic = (topicIndex: number) => {
    const updatedTopics = formik.values.topics.filter(
      (_, index) => index !== topicIndex
    );
    formik.setFieldValue("topics", updatedTopics);
  };

  const addSubtopic = (topicIndex: number) => {
    formik.setFieldValue(`topics.${topicIndex}.subtopics`, [
      ...formik.values.topics[topicIndex].subtopics,
      { title: "", description: "" },
    ]);
  };
  const removeSubtopic = (topicIndex: number, subtopicIndex: number) => {
    const updatedSubtopics = formik.values.topics[topicIndex].subtopics.filter(
      (_, index) => index !== subtopicIndex
    );
    formik.setFieldValue(`topics.${topicIndex}.subtopics`, updatedSubtopics);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await APIService.createSyllabus({
          ...values,
          class: +values.class,
          academic_year: +values.academic_year,
          createdOn: new Date().toISOString(),
        });
        toast.success("Syllabus added successfully");
        formik.resetForm();
      } catch (e: any) {
        toast.error(e.message || "Something went wrong!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Typography variant="h1" sx={{ letterSpacing: 1, fontWeight: "200" }}>
        Syllabus
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <FormControl
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
            error={formik.touched.board && Boolean(formik.errors.board)}
          >
            <InputLabel>Board</InputLabel>
            <Select
              name="board"
              label="Board"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.board}
            >
              <MenuItem value="CBSE">CBSE</MenuItem>
              <MenuItem value="ICSE">ICSE</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
            error={formik.touched.class && Boolean(formik.errors.class)}
          >
            <InputLabel>Class</InputLabel>
            <Select
              name="class"
              label="Class"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.class}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
            error={formik.touched.subject && Boolean(formik.errors.subject)}
          >
            <InputLabel>Subject</InputLabel>
            <Select
              name="subject"
              label="Subject"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.subject}
            >
              <MenuItem value="MATH">ENGLISH</MenuItem>
              <MenuItem value="PHYSICS">PHYSICS</MenuItem>
              <MenuItem value="CHEMISTRY">CHEMISTRY</MenuItem>
              <MenuItem value="MBIOLOGYATH">BIOLOGY</MenuItem>
              <MenuItem value="GEOGRAPHY">GEOGRAPHY</MenuItem>
              <MenuItem value="MATH">MATH</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
            error={
              formik.touched.academic_year &&
              Boolean(formik.errors.academic_year)
            }
          >
            <InputLabel>Academic Year</InputLabel>
            <Select
              name="academic_year"
              label="Academic Year"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.academic_year}
            >
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="2022">2022</MenuItem>
              <MenuItem value="2021">2021</MenuItem>
              <MenuItem value="2020">2020</MenuItem>
              <MenuItem value="2019">2019</MenuItem>
              <MenuItem value="2018">2018</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          label="Syllabus Description"
          multiline
          rows={4}
          name="syllabus_description"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.syllabus_description}
          error={
            formik.touched.syllabus_description &&
            Boolean(formik.errors.syllabus_description)
          }
          margin="normal"
        />

        <p style={{ marginTop: "20px" }}>Add Topics (Optional)</p>
        <hr />

        {formik.values.topics.map((topic, topicIndex) => (
          <div
            key={topicIndex}
            style={{
              border: "1px dashed gray",
              padding: "5px",
              marginTop: "18px",
              position: "relative",
            }}
          >
            #{topicIndex + 1}
            <IconButton
              sx={{ position: "absolute", right: -7, top: -6 }}
              color="error"
              onClick={() => removeTopic(topicIndex)}
            >
              <CancelOutlined />
            </IconButton>
            <Box sx={{ display: "", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Topic Title"
                  name={`topics.${topicIndex}.title`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={topic.title}
                  margin="dense"
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Topic Description"
                  rows={3}
                  name={`topics.${topicIndex}.description`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={topic.description}
                  margin="dense"
                  size="small"
                />
              </Box>
              <div style={{ fontSize: "14px", marginTop: "18px" }}>
                Sub-Topics
              </div>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "stretch",
                  width: "100%",
                }}
              >
                {topic.subtopics.map((subtopic, subtopicIndex) => (
                  <Box
                    key={subtopicIndex}
                    sx={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      padding: 0,
                      gap: 2,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Sub-Topic Title"
                      name={`topics.${topicIndex}.subtopics.${subtopicIndex}.title`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={subtopic.title}
                      margin="dense"
                      size="small"
                    />

                    <TextField
                      fullWidth
                      label="Sub-Topic Description"
                      rows={2}
                      name={`topics.${topicIndex}.subtopics.${subtopicIndex}.description`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={subtopic.description}
                      margin="dense"
                      size="small"
                    />
                    <IconButton
                      onClick={() => removeSubtopic(topicIndex, subtopicIndex)}
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                  </Box>
                ))}

                <IconButton
                  sx={{ background: "skyblue" }}
                  color="primary"
                  onClick={() => addSubtopic(topicIndex)}
                >
                  <PlusOneOutlined />
                </IconButton>
              </Box>
            </Box>
          </div>
        ))}

        <Box sx={{ textAlign: "end", paddingY: 1 }}>
          <Button variant="outlined" type="button" onClick={addTopic}>
            Add Topic
          </Button>
        </Box>
        <Box sx={{ textAlign: "center", paddingY: 1 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
          >
            Submit
          </Button>
        </Box>
      </form>
    </>
  );
};

export default Syllabus;
