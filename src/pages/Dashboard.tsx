import React, { useEffect, useState } from "react";
import { ISchool } from "../models/school";
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddSchool from "../components/AddSchool";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  deleteSchool,
  fetchAllSchool,
  updateSchool,
} from "../store/schoolSlice";
import { RootState } from "../store/store";
import { APIService } from "../services/apiService";
import { toast } from "react-toastify";
import { Check, CloseOutlined, Edit } from "@mui/icons-material";
import { API_STATUSES } from "../models/api-status";

export type SORT_BY = "A-Z" | "Z-A";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [updatedData, setUpdatedData] = useState<Partial<ISchool>>({});
  const [sort, setSort] = useState<SORT_BY>("A-Z");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [filteredSchool, setFilteredSchool] = useState<ISchool[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const tempSchool = useAppSelector((state: RootState) => state.school);

  const columnHelper = createColumnHelper<ISchool>();
  const columns = [
    columnHelper.accessor((row) => row.name, {
      id: "name",
      header: () => <span>Name</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.board, {
      id: "board",
      header: () => <span>Board</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.medium, {
      id: "medium",
      header: () => <span>Medium</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.class, {
      id: "class",
      header: () => <span>Class</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.class, {
      id: "actions",
      header: () => <span>Actions</span>,
      cell: (info) =>
        info.row.id === editingRowId ? (
          <IconButton onClick={() => handleUpdateSchool(info)}>
            {" "}
            <Check />{" "}
          </IconButton>
        ) : (
          <>
            <IconButton onClick={() => handleEditClick(info)}>
              {" "}
              <Edit />{" "}
            </IconButton>
            <IconButton
              color="warning"
              onClick={() => deleteSchoolHandler(info)}
            >
              <CloseOutlined />
            </IconButton>
          </>
        ),
    }),
  ];

  const table = useReactTable({
    data: filteredSchool,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleInputChange = (field: keyof ISchool, value: string) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const deleteSchoolHandler = async (info: CellContext<ISchool, number>) => {
    setLoading(true);
    let id = info.row.original.$id;
    try {
      await APIService.deleteSchool(id);
      dispatch(deleteSchool(id));
      toast.success("School deleted successfully!");
    } catch (e: any) {
      toast.error(e.message || "Somethong went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (info: CellContext<ISchool, number>) => {
    let data: Partial<ISchool> = {
      name: info.row.getValue("name"),
      board: info.row.getValue("board"),
      medium: info.row.getValue("class"),
      class: info.row.getValue("class"),
    };
    setUpdatedData(data);
    setEditingRowId(info.row.id);
  };

  const handleUpdateSchool = async (info: CellContext<ISchool, number>) => {
    setLoading(true);
    let id = info.row.original.$id;
    try {
      await APIService.updateSchool(updatedData, id);
      setEditingRowId(null);
      dispatch(updateSchool({ data: updatedData, id: id }));
      toast.success("Updated successfully!");
    } catch (e: any) {
      toast.error(e.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const filterSchool = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let value = e.target.value;
    if (tempSchool.data) {
      setFilteredSchool(
        tempSchool.data.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleSort = (sortBy: SORT_BY) => {
    setFilteredSchool(sortSchool(filteredSchool, sortBy));
  };

  const sortSchool = (schools: ISchool[], sortBy: SORT_BY) => {
    setSort(sortBy);
    let allSchools = [...schools];
    let tempSchool: ISchool[] = [];
    if (sortBy === "A-Z") {
      tempSchool = allSchools.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Z-A") {
      tempSchool = allSchools.sort((a, b) => b.name.localeCompare(a.name));
    }
    return tempSchool;
  };

  useEffect(() => {
    dispatch(fetchAllSchool());
    if (tempSchool.data) {
      setFilteredSchool(sortSchool(tempSchool.data, "A-Z"));
    }
  }, [tempSchool]);

  return (
    <>
      {tempSchool.status == API_STATUSES.LOADING ? (
        <Box sx={{minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <CircularProgress size={80} thickness={2} />
        </Box>
      ) : (
        <>
          <Typography variant="h1" sx={{ letterSpacing: 1, fontWeight: "200" }}>
            Dashboard
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              mt: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                label="Search"
                margin="none"
                size="small"
                onChange={(e) => filterSchool(e)}
              />
              <small>Sort By:</small>
              <FormControl size="small" margin="none" variant="standard">
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sort}
                  onChange={(e) => handleSort(e.target.value as SORT_BY)}
                >
                  <MenuItem value="A-Z">A-Z</MenuItem>
                  <MenuItem value="Z-A">Z-A</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {tempSchool.data?.length === 0 ? null : (
              <Button
                variant="contained"
                onClick={() => setOpenModal(!openModal)}
              >
                Add
              </Button>
            )}
          </Box>
          {tempSchool.data?.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingY: "150px",
              }}
            >
              <p style={{ color: "gray" }}>You don't have any school yet</p>
              <Button
                variant="contained"
                onClick={() => setOpenModal(!openModal)}
              >
                Add School
              </Button>
            </Box>
          ) : (
            <>
              {loading ? (
                <LinearProgress />
              ) : (
                <Box sx={{ height: "4px" }}></Box>
              )}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableCell key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableHead>
                  {filteredSchool.length === 0 ? (
                    <TableBody>
                      <TableRow>
                        <TableCell>No data...</TableCell>
                      </TableRow>
                    </TableBody>
                  ) : (
                    <TableBody>
                      {table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          {row.getVisibleCells().map((cell, index) => (
                            <TableCell key={cell.id}>
                              {editingRowId === row.id &&
                              index !== row.getAllCells().length - 1 ? (
                                <TextField
                                  type={
                                    cell.column.id == "class"
                                      ? "number"
                                      : "text"
                                  }
                                  size="small"
                                  margin="none"
                                  value={
                                    updatedData[cell.column.id as keyof ISchool]
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      cell.column.id as keyof ISchool,
                                      e.target.value
                                    )
                                  }
                                />
                              ) : (
                                flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </>
          )}
          <AddSchool open={openModal} handleClose={() => setOpenModal(false)} />
        </>
      )}
    </>
  );
};

export default Dashboard;
