import React, { useState } from "react";
import './TaskTable.css';
import CreateBtn from "../Create-Btn/Create-Btn";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removed } from "../../features/tasks/tasksSlice";
import { IconButton, Menu, Chip, Button, Box, Select, MenuItem, FormLabel, TextField } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

function TaskTable() {
  const tasks = useSelector(s => s.tasks.items);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const [field, setField] = useState("");             
  const [pendingValue, setPendingValue] = useState("");
  const [appliedFilter, setAppliedFilter] = useState({ field: "", value: "" });

  const handleToggle = (e) => { 
    if (anchorEl) { 
      setAnchorEl(null); 
    } 
    else { 
      setAnchorEl(e.currentTarget); 
    } 
  };

  const handleClose = () => setAnchorEl(null);

  const applyFilter = () => {
    if (field && pendingValue) {
      setAppliedFilter({ field, value: pendingValue });
    } else {
      setAppliedFilter({ field: "", value: "" });
    }
    handleClose();
  };

  const clearFilter = () => {
    setAppliedFilter({ field: "", value: "" });
    setPendingValue("");
    setField("");
  };

  const filteredTasks = tasks.filter(task => {
    if (!appliedFilter.field || !appliedFilter.value) return true;

    if (appliedFilter.field === "status") {
      return task.status === appliedFilter.value;
    }

    if (appliedFilter.field === "priority") {
      return task.priority === appliedFilter.value;
    }

    if (appliedFilter.field === "date") {
      return task.date === appliedFilter.value;
    }

    return true;
  });

  return (
    <div className="task-table-section">
      <div 
        className="tool-row" 
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Box>
          <IconButton onClick={handleToggle} color="primary">
            <FilterListIcon />
          </IconButton>

          {appliedFilter.field && (
            <Chip
              label={`${appliedFilter.field}: ${appliedFilter.value}`}
              onDelete={clearFilter}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        <CreateBtn navigate="/Task/Create" />
      </div>

      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleClose}
      >
        <Box 
          sx={{ p: 2, width: "220px", display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormLabel>Filter by</FormLabel>

          <Select
            value={field}
            onChange={(e) => { setField(e.target.value); setPendingValue(""); }}
            displayEmpty
          >
            <MenuItem value="">Select Column</MenuItem>
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="date">Deadline</MenuItem>
          </Select>

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
            <TextField
              type="date"
              value={pendingValue}
              onChange={(e) => setPendingValue(e.target.value)}
              size="small"
            />
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
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.name}</td>
                  <td>{task.description}</td>
                  <td>{task.date}</td>
                  <td>{task.assignee}</td>
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
                    <Link to={`/Task/Edit/${task.id}`}>
                      <i className="fa-solid fa-pen"></i>
                    </Link>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => dispatch(removed(task.id))}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No tasks found for the selected filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskTable;
