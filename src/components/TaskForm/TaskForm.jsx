import React, { useEffect, useState } from "react";
import "./TaskForm.css";
import { useDispatch, useSelector } from "react-redux";
import { added, updated } from "../../features/tasks/tasksSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import FallBack from "../FallBack/FallBack";

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Pending", "In Progress", "Completed", "Rejected"];
const today = dayjs().startOf("day");

const schema = yup.object({
  name: yup
    .string()
    .trim("No leading/trailing spaces allowed")
    .strict(true)
    .required("Required")
    .min(3, "Min 3 chars")
    .matches(/\S/, "Cannot be only spaces"),

  description: yup
    .string()
    .trim("No leading/trailing spaces allowed")
    .strict(true)
    .required("Required")
    .min(10, "Min 10 chars")
    .matches(/\S/, "Cannot be only spaces"),

  assigneeId: yup.mixed().required("Required"),
  priority: yup.string().required("Required").oneOf(PRIORITIES),
  status: yup.string().required("Required").oneOf(STATUSES),
  date: yup
    .mixed()
    .required("Required")
    .test("is-dayjs", "Select a date from the picker", (v) => dayjs.isDayjs(v) && v.isValid())
    .test("not-past", "Cannot be in the past", (v) => {
      if (!dayjs.isDayjs(v)) return false;
      const d = v.startOf("day");
      return d.isSame(today) || d.isAfter(today);
    }),
});


function TaskForm() {
  const { id } = useParams();
  const tasks = useSelector((state) => state.tasks.items);
  const profiles = useSelector((state) => state.auth.profiles);
  const { currentUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { control, handleSubmit, reset, formState: { errors }, register } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      assigneeId: currentUser?.role === "user" ? currentUser.id : null,
      priority: "",
      date: null,
      status: "Pending",
    },
  });

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      const existingTask = tasks.find((task) => String(task.id) === String(id));
      if (existingTask) {
        if (currentUser?.role === "user" && String(existingTask.assigneeId) !== String(currentUser.id)) {
          setNotFound(true);
          return;
        }

        reset({
          ...existingTask,
          date: existingTask.date ? dayjs(existingTask.date) : null,
        });
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    }
  }, [id, reset, tasks, currentUser]);

  const onSubmit = (data) => {
    if (currentUser?.role === "user") {
      data.assigneeId = currentUser.id;
    }

    const taskData = {
      ...data,
      date: data.date.format("YYYY-MM-DD"),
    };

    if (id) {
      dispatch(updated({ id, changes: taskData }));
      toast.success("✅ Task updated successfully!");
    } else {
      dispatch(added(taskData));
      toast.success("✅ Task created successfully!");
    }
    navigate("/tasks");
  };

  if (notFound) {
    return <FallBack message="Task not found or access denied." />;
  }

  const assigneeOptions = currentUser?.role === "user"
    ? [profiles.find((p) => String(p.id) === String(currentUser.id))].filter(Boolean)
    : profiles;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form className="TaskForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="TaskSubject">
          <label>Task Subject</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="TaskSubjectInput"
                placeholder="Enter Task Subject..."
                inputProps={{ maxLength: 100 }}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </div>

        <div className="TaskDescription">
          <label>Task Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="TaskDescriptionInput"
                placeholder="Enter Task Description..."
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
        </div>

        <div className="form-group">
          {currentUser?.role && (
            <div className="AssignTaskSection">
              <label>Assign task to</label>
              <Controller
                name="assigneeId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    disablePortal
                    disableClearable
                    options={assigneeOptions}
                    getOptionLabel={(option) => option.name}
                    value={assigneeOptions.find((p) => String(p.id) === String(field.value)) || null}
                    onChange={(event, newValue) => field.onChange(newValue?.id || null)}
                    disabled={currentUser?.role === "user"}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="-- Select Assignee --"
                        error={!!errors.assigneeId}
                        helperText={errors.assigneeId?.message}
                      />
                    )}
                  />
                )}
              />
            </div>
          )}

          <div className="TaskPriority">
            <label>Task Priority</label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className="PrioritySelect"
                  displayEmpty
                  error={!!errors.priority}
                  renderValue={(selected) =>
                    selected ? selected : <span>-- Select Priority --</span>
                  }
                >
                  <MenuItem value="">-- Select Priority --</MenuItem>
                  {PRIORITIES.map((priority, i) => (
                    <MenuItem key={i} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.priority && <p className="error-text">{errors.priority.message}</p>}
          </div>

          <div className="Deadline">
            <label>Task Deadline</label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value || null}
                  onChange={(newVal) => field.onChange(newVal)}
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: {
                      placeholder: "-- Select date --",
                      fullWidth: true,
                      variant: "outlined",
                      className: "DeadlineInput",
                      error: !!errors.date,
                      helperText: errors.date?.message,
                    },
                  }}
                />
              )}
            />
          </div>

          {id && (
            <div className="Status">
              <label>Task Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
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
                    {STATUSES.map((status, i) => (
                      <MenuItem key={i} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.status && <p className="error-text">{errors.status.message}</p>}
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
