import React, { useState, useEffect, useMemo } from "react";
import "./TaskTable.css";
import CreateBtn from "../Create-Btn/Create-Btn";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteTask, fetchTasks } from "../../features/tasks/tasksSlice";
import { IconButton, Menu, Chip, Button, Box, Select, MenuItem, FormLabel, TextField, Pagination, Tooltip, } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import api from "../../lib/api";

function TaskTable() {
  const { id } = useParams();

  const tasks = useSelector((s) => s.tasks.items);
  const { priorities, statuses } = useSelector((s) => s.tasks.meta);
  const { currentUser } = useSelector((s) => s.auth);
  const profiles = useSelector((s) => s.profiles.profiles);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [field, setField] = useState("");
  const [pendingValue, setPendingValue] = useState("");
  const [appliedFilter, setAppliedFilter] = useState({ field: "", value: "" });

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const handlePageChange = (e, value) => setPage(value);
  const handleToggle = (e) => setAnchorEl(anchorEl ? null : e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const normalizeDate = (d) => {
    if (!d) return "";
    const parsed = dayjs(d);
    return parsed.isValid() ? parsed.format("YYYY-MM-DD") : String(d);
  };

  const isUuid = (val) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      String(val).trim()
    );

  const buildNetworkSearch = (flt) => {
    if (!flt.field || !flt.value) return "";
    if (flt.field === "assignee") {
      const p = profiles.find((x) => String(x.id) === String(flt.value));
      return p?.name || String(flt.value);
    }
    if (flt.field === "date") return String(flt.value);
    return String(flt.value);
  };

  const applyFilter = async () => {
    if (field && pendingValue) {
      const next = { field, value: field === "id" ? pendingValue.trim() : pendingValue };
      setAppliedFilter(next);
      setPage(1);

      const networkSearch = buildNetworkSearch(next);
      const canServerFilterBySearch = next.field === "status" || next.field === "priority";
      const canServerFilterById = next.field === "id" && isUuid(next.value);

      try {
        if (canServerFilterById) {
          await dispatch(fetchTasks({ id: next.value }));
        } else if (canServerFilterBySearch) {
          await dispatch(fetchTasks({ search: networkSearch }));
        } else {
          try {
            await api.get("/task", { params: { search: networkSearch } });
          } catch {}
        }
      } catch { }
    } else {
      await handleClearFilter();
    }
    handleClose();
  };

  const handleClearFilter = async () => {
    setAppliedFilter({ field: "", value: "" });
    setPendingValue("");
    setField("");
    setPage(1);
    try {
      await dispatch(fetchTasks({}));
    } catch {}
  };

  const clearFilterChip = async () => {
    await handleClearFilter();
  };

  const closeFilter = () => {
    setField("");
    setPendingValue("");
    handleClose();
  };

  const handleDelete = async (taskId) => {
    try {
      await dispatch(deleteTask(taskId));
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to delete task.");
    }
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
    if (appliedFilter.field === "status") return task.status === appliedFilter.value;
    if (appliedFilter.field === "priority") return task.priority === appliedFilter.value;
    if (appliedFilter.field === "date") return normalizeDate(task.date) === String(appliedFilter.value);
    if (currentUser?.role !== "user" && !id && appliedFilter.field === "assignee") {
      return String(task.assigneeId) === String(appliedFilter.value);
    }
    return true;
  });

  const startIndex = (page - 1) * rowsPerPage;
  const paginatedTasks = useMemo(
    () => fullyFilteredTasks.slice(startIndex, startIndex + rowsPerPage),
    [fullyFilteredTasks, startIndex]
  );
  const pageCount = Math.ceil(fullyFilteredTasks.length / rowsPerPage);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount > 0 ? pageCount : 1);
  }, [page, pageCount]);

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
              onDelete={clearFilterChip}
              variant="outlined"
              className="chip"
            />
          )}
        </Box>
        <CreateBtn navigate="/tasks/Create" />
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <FormLabel>Filter by</FormLabel>
            <IconButton
              size="small"
              onClick={closeFilter}
              sx={{
                color: "var(--dark-color)",
                "&:hover": { color: "var(--gray)" },
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>

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
              {(statuses.length
                ? statuses
                : ["Pending", "In Progress", "Completed", "Rejected"]
              ).map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          )}

          {field === "priority" && (
            <Select
              value={pendingValue}
              onChange={(e) => setPendingValue(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select Priority</MenuItem>
              {(priorities.length ? priorities : ["Low", "Medium", "High"]).map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
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

          {currentUser?.role !== "user" && field === "assignee" && !id && (
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
                  <td>{normalizeDate(task.date)}</td>
                  <td>
                    {profiles.find((p) => String(p.id) === String(task.assigneeId))?.name ||
                      task.assigneeName ||
                      task.assigneeId}
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
                    <Tooltip title="Edit">
                      <IconButton
                        component={Link}
                        to={`/tasks/Edit/${task.id}`}
                        className="edit-btn"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

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
                  No Task Found.
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
