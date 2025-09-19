import React, { useEffect, useState } from "react";
import "./TaskForm.css";
import { useDispatch, useSelector } from "react-redux";
import { added, updated } from "../../features/tasks/tasksSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Profiles from "../../data/Profile";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import FallBack from "../FallBack/FallBack";

function TaskForm() {
  const { id } = useParams();
  const tasks = useSelector((s) => s.tasks.items);

  const [form, setForm] = useState({
    name: "",
    description: "",
    assignee: "",
    priority: "",
    date: "",
    status: "Pending",
  });

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      const existingTask = tasks?.find((t) => String(t.id) === String(id));
      if (existingTask) {
        setForm(existingTask);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    }
  }, [id, tasks]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const priorities = ["Low", "Medium", "High"];
  const statuses = ["Pending", "In Progress", "Completed", "Rejected"];

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validateForm = () => {
    if (!form.name || !form.description || !form.assignee || !form.priority || !form.date) {
      toast.error("⚠️ Please fill in all fields!");
      return false;
    }

    if (form.name.trim().length < 3) {
      toast.error("⚠️ Task name must be at least 3 characters!");
      return false;
    }

    if (form.description.trim().length < 10) {
      toast.error("⚠️ Description must be at least 10 characters!");
      return false;
    }

    const today = new Date().toISOString().split("T")[0];
    if (form.date < today) {
      toast.error("⚠️ Deadline cannot be in the past!");
      return false;
    }

    return true;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (id) {
      dispatch(updated({ id, changes: form }));
      toast.success("✅ Task updated successfully!");
      navigate("/tasks");
    } else {
      dispatch(added(form));
      toast.success("✅ Task created successfully!");
      navigate("/tasks");
    }
  };

  if (notFound) {
    return <FallBack message="Task not found." />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form className="TaskForm" onSubmit={onSubmit}>
        <div className="TaskSubject">
          <label>Task Subject</label>
          <TextField
            name="name"
            value={form.name}
            onChange={onChange}
            className="TaskSubjectInput"
            placeholder="Enter Task Subject..."
            inputProps={{ maxLength: 100 }}
          />
        </div>

        <div className="TaskDescription">
          <label>Task Description</label>
          <TextField
            name="description"
            value={form.description}
            onChange={onChange}
            className="TaskDescriptionInput"
            placeholder="Enter Task Description..."
            multiline
            rows={4}   
          />
        </div>

        <div className="form-group">
          <div className="AssignTaskSection">
            <label>Assign task to</label>
            <Autocomplete
              className="AutocompleteElement"
              disablePortal
              disableClearable
              options={Profiles.map((profile) => profile.name)}
              value={form.assignee || ""}
              onChange={(e, newValue) =>
                setForm((f) => ({ ...f, assignee: newValue || "" }))
              }
              fullWidth
              renderInput={(params) => (
                <TextField {...params} placeholder="-- Select Assignee --" />
              )}
            />
          </div>

          <div className="TaskPriority">
            <label>Task Priority</label>
            <Select
              name="priority"
              className="PrioritySelect"
              value={form.priority}
              onChange={onChange}
              displayEmpty
              fullWidth
              inputProps={{ "aria-label": "Without label" }}
              renderValue={(selected) =>
                selected ? selected : <span>-- Select Priority --</span>
              }
            >
              <MenuItem value="">
                -- Select Priority --
              </MenuItem>
              {priorities.map((priority, index) => (
                <MenuItem key={index} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className={`Deadline ${form.date ? "has-value" : ""}`}>
            <label>Task Deadline</label>
            <DatePicker
              value={form.date ? dayjs(form.date) : null}
              onChange={(newValue) => {
                const v = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
                setForm((f) => ({ ...f, date: v }));
              }}
              format="YYYY-MM-DD"
              slotProps={{
                textField: {
                  placeholder: "-- Select date --",
                  fullWidth: true,
                  variant: "outlined",
                  className: "DeadlineInput",
                },
              }}
            />
          </div>


          {id && (
            <div className="Status">
              <label>Task Status</label>
              <Select
                name="status"
                value={form.status}
                onChange={onChange}
                displayEmpty
                fullWidth
                className="EditStatusSelect"
                renderValue={(selected) =>
                  selected ? selected : <em>-- Select Status --</em>
                }
              >
                <MenuItem value="">
                  <em>-- Select Status --</em>
                </MenuItem>
                {statuses.map((status, index) => (
                  <MenuItem key={index} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}
        </div>

        <button className="submit-btn" type="submit">
          {id ? "Save Changes" : "Create Task"}
        </button>
      </form>
    </LocalizationProvider>
  );
}

export default TaskForm;
