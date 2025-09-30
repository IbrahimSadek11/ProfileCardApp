import React, { useState } from "react";
import "./TaskTable.css";
import CreateBtn from "../Create-Btn/Create-Btn";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removed } from "../../features/tasks/tasksSlice";
import { IconButton, Menu, Chip, Button, Box, Select, MenuItem, FormLabel, TextField, Pagination, Tooltip, } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import { toast } from "react-toastify";
import FallBack from "../../components/FallBack/FallBack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect } from "react";

function TaskTable() {
  const { id } = useParams();

  const tasks = useSelector((s) => s.tasks.items);
  const { currentUser } = useSelector((s) => s.auth);
  const profiles = useSelector((s) => s.auth.profiles);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [field, setField] = useState("");
  const [pendingValue, setPendingValue] = useState("");
  const [appliedFilter, setAppliedFilter] = useState({ field: "", value: "" });

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const handlePageChange = (e, value) => {
    setPage(value);
  };

  const handleToggle = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const applyFilter = () => {
    if (field && pendingValue) {
      if (field === "id" && pendingValue.trim() === "") {
        toast.error("⚠️ Please enter a valid Task ID", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        setAppliedFilter({
          field,
          value: field === "id" ? pendingValue.trim() : pendingValue,
        });
        setPage(1);
      }
    } else {
      setAppliedFilter({ field: "", value: "" });
    }
    handleClose();
  };

  const clearFilter = () => {
    setAppliedFilter({ field: "", value: "" });
    setPendingValue("");
    setField("");
    setPage(1);
  };

  const handleDelete = (id) => {
    dispatch(removed(id));
    toast.success(`🗑️ Task deleted successfully!`);
  };

  const roleFilteredTasks = tasks.filter((task) => {
    if (currentUser?.role === "user") {
      return String(task.assigneeId) === String(currentUser.id);
    }
    return true;
  });

  const routeFilteredTasks = roleFilteredTasks.filter((task) => {
    if (id && String(task.assigneeId) !== String(id)) return false;
    return true;
  });

  const fullyFilteredTasks = routeFilteredTasks.filter((task) => {
    if (!appliedFilter.field || !appliedFilter.value) return true;

    if (appliedFilter.field === "id") {
      return String(task.id).toLowerCase().includes(String(appliedFilter.value).toLowerCase());
    }
    if (appliedFilter.field === "status") {
      return task.status === appliedFilter.value;
    }
    if (appliedFilter.field === "priority") {
      return task.priority === appliedFilter.value;
    }
    if (appliedFilter.field === "date") {
      return task.date === appliedFilter.value;
    }
    if (currentUser?.role !== "user" && !id && appliedFilter.field === "assignee") {
      return String(task.assigneeId) === String(appliedFilter.value);
    }
    return true;
  });

  const startIndex = (page - 1) * rowsPerPage;
  const paginatedTasks = fullyFilteredTasks.slice(startIndex, startIndex + rowsPerPage);
  const pageCount = Math.ceil(fullyFilteredTasks.length / rowsPerPage);
  
  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount > 0 ? pageCount : 1);
    }
  }, [page, pageCount]);

  if (currentUser?.role === "user" && id && String(currentUser.id) !== String(id)) {
    return <FallBack message="⛔ Access denied: You cannot view other users' tasks." />;
  }

  return (
    <div className="task-table-section">
      <div className="tool-row">
        <Box>
          <label className="Filter">Select Filter :</label>
          <Tooltip title="Filter">
            <IconButton onClick={handleToggle}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>

          {appliedFilter.field && (
            <Chip
              label={
                appliedFilter.field === "assignee"
                  ? `Assignee: ${
                      profiles.find((p) => String(p.id) === String(appliedFilter.value))?.name ||
                      appliedFilter.value
                    }`
                  : `${appliedFilter.field}: ${appliedFilter.value}`
              }
              onDelete={clearFilter}
              variant="outlined"
              className="chip"
            />
          )}
        </Box>

        {(currentUser?.role === "admin" || currentUser?.role === "user") && (
          <CreateBtn navigate="/tasks/Create" />
        )}
      </div>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <Box
          sx={{
            p: 2,
            width: "220px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <FormLabel>Filter by</FormLabel>

          <Select
            sx={{ height: "40px" }}
            value={field}
            onChange={(e) => {
              setField(e.target.value);
              setPendingValue("");
            }}
            displayEmpty
          >
            <MenuItem value="">Select Column</MenuItem>
            <MenuItem value="id">ID</MenuItem>
            {currentUser?.role !== "user" && !id && (
              <MenuItem value="assignee">Assignee</MenuItem>
            )}
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="date">Deadline</MenuItem>
          </Select>

          {field === "id" && (
            <TextField
              placeholder="Enter Task ID"
              value={pendingValue}
              onChange={(e) => setPendingValue(e.target.value)}
              size="small"
            />
          )}

          {field === "status" && (
            <Select
              value={pendingValue}
              onChange={(e) => setPendingValue(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          )}

          {field === "priority" && (
            <Select
              value={pendingValue}
              onChange={(e) => setPendingValue(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select Priority</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          )}

          {field === "date" && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={pendingValue ? dayjs(pendingValue) : null}
                onChange={(newVal) =>
                  setPendingValue(newVal ? newVal.format("YYYY-MM-DD") : "")
                }
                format="YYYY-MM-DD"
                slotProps={{
                  textField: {
                    placeholder: "YYYY-MM-DD",
                    fullWidth: true,
                    variant: "standard",
                    sx: {
                      "& .MuiPickersInputBase-root": {
                        height: "50px",
                        border: `1px solid var(--gray-300)`,
                        borderRadius: "5px",
                        backgroundColor: "var(--lightWhite-color)",
                        display: "flex",
                        alignItems: "center",
                      },
                      "& .MuiPickersInputBase-root:before, & .MuiPickersInputBase-root:after": {
                        borderBottom: "none !important",
                      },
                      "& .MuiPickersSectionList-root": {
                        borderBottom: "none !important",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color:"var(--dark-color)",
                        opacity: 1,
                        height: "100%",
                      },
                      "& .MuiPickersSection-root": {
                        display: "flex",
                        alignItems: "center",
                      },
                      "& .MuiIconButton-root": {
                        color: "var(--dark-color)",
                      },
                    },
                  },
                  popper: {
                    sx: {
                      "& .MuiPaper-root": {
                        backgroundColor: "var(--lightWhite-color)",
                        color: "var(--dark-color)",
                        borderRadius: "10px",
                        border: "1px solid var(--gray-300)",
                      },
                      "& .MuiPickersDay-root": {
                        color: "var(--dark-color)",
                        borderRadius: "8px",
                      },
                      "& .MuiPickersDay-root:not(.Mui-selected)": {
                        borderColor: "var(--dark-color)",
                      },
                      "& .MuiPickersDay-root.Mui-selected": {
                        backgroundColor: "var(--main-color)",
                        color: "var(--white-color)",
                        "&:hover": { backgroundColor: "var(--main-color-alt)" },
                      },
                      "& .MuiDayCalendar-weekDayLabel": { color: "var(--dark-color)" },
                      "& .MuiPickersCalendarHeader-label": { color: "var(--dark-color)" },
                      "& .MuiIconButton-root": { color: "var(--dark-color)" },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          )}

          {currentUser?.role !== "user" && !id && field === "assignee" && (
            <Select
              value={pendingValue}
              onChange={(e) => setPendingValue(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select Assignee</MenuItem>
              {profiles.map((profile) => (
                <MenuItem key={profile.id} value={profile.id}>
                  {profile.name}
                </MenuItem>
              ))}
            </Select>
          )}

          <Button variant="contained" onClick={applyFilter}>
            Apply Filter
          </Button>
        </Box>
      </Menu>

      <div className="task-table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <td>ID</td>
              <td>Task</td>
              <td>Description</td>
              <td>Deadline</td>
              <td>Assignee</td>
              <td>Priority</td>
              <td>Status</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.length > 0 ? (
              paginatedTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.name}</td>
                  <td>{task.description}</td>
                  <td>{task.date}</td>
                  <td>
                    {profiles.find((p) => String(p.id) === String(task.assigneeId))?.name}
                  </td>
                  <td>{task.priority}</td>
                  <td>
                    <span
                      className={`status-label ${
                        task.status === "Pending"
                          ? "status-pending"
                          : task.status === "In Progress"
                          ? "status-inprogress"
                          : task.status === "Completed"
                          ? "status-completed"
                          : "status-rejected"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>
                    {(currentUser?.role === "admin" ||
                      String(task.assigneeId) === String(currentUser.id)) && (
                      <Tooltip title="Edit">
                        <IconButton
                          component={Link}
                          to={`/tasks/Edit/${task.id}`}
                          className="edit-btn"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete" sx={{ padding: "0px" }}>
                      <IconButton
                        onClick={() => handleDelete(task.id)}
                        className="delete-btn"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="Table-fallback">
                  <FallBack message="No tasks found." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </div>
  );
}

export default TaskTable;
