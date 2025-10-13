import React, { useEffect, useMemo, useState } from "react";
import "./TaskForm.css";
import { useDispatch, useSelector } from "react-redux";
import { createTask, updateTask } from "../../features/tasks/tasksSlice";
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

const makeSchemas = (PRIORITIES, STATUSES) => {
  const baseSchema = {
    name: yup
      .string()
      .trim("No leading/trailing spaces allowed")
      .strict(true)
      .required("Required")
      .matches(/\S/, "Cannot be only spaces")
      .matches(/^(?!.*\s{2,}).*$/, "Name cannot contain multiple spaces in a row")
      .min(3, "Min 3 chars"),

    description: yup
      .string()
      .trim("No leading/trailing spaces allowed")
      .strict(true)
      .required("Required")
      .matches(/\S/, "Cannot be only spaces")
      .matches(/^(?!.*\s{2,}).*$/, "Name cannot contain multiple spaces in a row")
      .min(10, "Min 10 chars"),

    assigneeId: yup.mixed().required("Required"),
    priority: yup.string().required("Required").oneOf(PRIORITIES),
    status: yup.string().required("Required").oneOf(STATUSES),
  };

  const today = dayjs().startOf("day");

  const createSchema = yup.object({
    ...baseSchema,
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

  const editSchema = yup.object({
    ...baseSchema,
    date: yup
      .mixed()
      .required("Required")
      .test("is-dayjs", "Select a date from the picker", (v) => dayjs.isDayjs(v) && v.isValid()),
  });

  return { createSchema, editSchema };
};

function TaskForm() {
  const { id } = useParams();
  const tasks = useSelector((state) => state.tasks.items);
  const { priorities, statuses } = useSelector((state) => state.tasks.meta);
  const profiles = useSelector((state) => state.profiles.profiles);
  const { currentUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { createSchema, editSchema } = useMemo(
    () =>
      makeSchemas(
        priorities.length ? priorities : ["Low", "Medium", "High"],
        statuses.length ? statuses : ["Pending", "In Progress", "Completed", "Rejected"]
      ),
    [priorities, statuses]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(id ? editSchema : createSchema),
    defaultValues: {
      name: "",
      description: "",
      assigneeId: currentUser?.role === "user" ? currentUser.id : null,
      priority: "",
      date: null,
      status: statuses[0] || "Pending",
    },
  });

  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const existingTask = tasks.find((task) => String(task.id) === String(id));
      if (existingTask) {
        if (
          currentUser?.role === "user" &&
          String(existingTask.assigneeId) !== String(currentUser.id)
        ) {
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

  const onSubmit = async (data) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      if (currentUser?.role === "user") data.assigneeId = currentUser.id;

      const payload = {
        ...data,
        date: data.date.format("YYYY-MM-DD"),
      };

      if (id) {
        await dispatch(updateTask({ id, ...payload })).unwrap();
        toast.success("Task updated successfully!");
      } else {
        await dispatch(createTask(payload)).unwrap();
        toast.success("Task created successfully!");
      }

      navigate("/tasks");

    } catch (err) {
      toast.error(typeof err === "string" ? err : "Something went wrong.");
      setSubmitting(false);
    } 
  };

  if (notFound) return <FallBack message="Task not found or access denied." />;

  const assigneeOptions =
    currentUser?.role === "user"
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--white-color)", 
                    borderRadius: "10px",
                    "& fieldset": {
                      borderColor: "var(--gray-300)",
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--main-color)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--main-color)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "var(--dark-color)", 
                    "&::placeholder": {
                      color: "#9CA3AF",   
                      opacity: 1,         
                    },
                  },
                }}
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--white-color)", 
                    borderRadius: "10px",                  
                    "& fieldset": {
                      borderColor: "var(--gray-300)",
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--main-color)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--main-color)",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "var(--dark-color)",
                    "&::placeholder": {
                      color: "#9CA3AF",
                      opacity: 1,
                    },
                  },
                }}
              />
            )}
          />
        </div>

        <div className="form-group">
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
                  getOptionLabel={(option) => option?.name || ""}
                  value={
                    assigneeOptions.find((p) => String(p.id) === String(field.value)) || null
                  }
                  onChange={(event, newValue) => field.onChange(newValue?.id || null)}
                  disabled={currentUser?.role === "user"}
                  noOptionsText={<span style={{ color: "var(--dark-color)" }}>No options</span>}   
                  sx={{
                    width: "100%",
                    "& .MuiAutocomplete-input": {
                      textAlign: "center",
                      color: "var(--dark-color)",
                    },
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--white-color)",
                      borderRadius: "10px",
                    },
                    "& .MuiAutocomplete-option": {
                      color: "var(--dark-color)",
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="-- Select Assignee --"
                      error={!!errors.assigneeId}
                      helperText={errors.assigneeId?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "var(--white-color)",
                          borderRadius: "10px",
                          height: "50px",

                          "& fieldset": { borderColor: "var(--gray-300)"},
                          "&:hover fieldset": { borderColor: "var(--main-color)" },
                          "&.Mui-focused fieldset": { borderColor: "var(--main-color)" },

                          "&.Mui-disabled": {
                            backgroundColor: "var(--lightWhite-color)", 
                            
                          },
                          "&.Mui-disabled fieldset": {
                            borderColor: "var(--gray) !important",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "var(--dark-color)",
                          "&::placeholder": {
                            color: "#9CA3AF",
                            opacity: 1,
                          },
                        },
                        "& .MuiInputBase-input": {
                          textAlign: "center",
                          color: "var(--dark-color)",
                          "&.Mui-disabled": {
                            color: "var(--gray) !important",             
                            WebkitTextFillColor: "var(--gray) !important",
                            opacity: 1,
                          },
                        },
                        "& .MuiSvgIcon-root": {
                          color: currentUser?.role === "user" ? "var(--gray)" : "var(--dark-color)",
                        },
                        "&.Mui-disabled .MuiSvgIcon-root": {
                          color: "var(--gray) !important", 
                          opacity: 1,
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          </div>

          <div className="TaskPriority">
            <label>Task Priority</label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  displayEmpty
                  error={!!errors.priority}
                  renderValue={(selected) =>
                    selected ? selected : <span>-- Select Priority --</span>
                  }
                  sx={{
                    padding: "5px",
                    borderRadius: "10px",
                    textAlign: "center",
                    height: "50px",
                    width: "100%",
                    backgroundColor: "var(--white-color)",
                    color: "var(--dark-color)",

                    "& fieldset": {
                      borderColor: "var(--gray-300)",
                    },
                    "&:hover fieldset": {
                        borderColor: "var(--main-color) !important",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--main-color) !important",
                    },

                    "& span": {
                      color: "#9CA3AF", 
                    },
                    "& .MuiSelect-icon": {
                      color: "var(--gray)",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: "var(--lightWhite-color)",
                        color: "var(--dark-color)",                
                      },
                    },
                  }}
                >
                  <MenuItem value="">-- Select Priority --</MenuItem>
                  {(priorities.length ? priorities : ["Low", "Medium", "High"]).map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
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
                      placeholder: "YYYY-MM-DD",
                      fullWidth: true,
                      variant: "standard",
                      error: !!errors.date,
                      sx: {
                        "& .MuiPickersInputBase-root": {
                          height: "50px",
                          border: `1px solid ${errors.date ? "red" : "var(--gray-300)"}`,
                          borderRadius: "10px",
                          backgroundColor: "var(--white-color)",
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
                          color: field.value ? "var(--dark-color)" : "#9CA3AF",
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
                        zIndex: 10,
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
              )}
            />
            {errors.date && <p className="error-text">{errors.date.message}</p>}
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
                    error={!!errors.status}
                    renderValue={(selected) =>
                      selected ? selected : <em>-- Select Status --</em>
                    }
                    sx={{
                      padding: "5px",
                      borderRadius: "10px",
                      textAlign: "center",
                      height: "50px",
                      width: "100%",
                      backgroundColor: "var(--white-color)",
                      color: "var(--dark-color)",

                      "& fieldset": {
                        borderColor: "var(--gray-300)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--main-color) !important",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--main-color) !important",
                      },
                      "& em": {
                        color: "#9CA3AF",
                      },
                      "& .MuiSelect-icon": {
                        color: "var(--gray)",
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: "var(--lightWhite-color)",
                          color: "var(--dark-color)",
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>-- Select Status --</em>
                    </MenuItem>
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
              />
              {errors.status && <p className="error-text">{errors.status.message}</p>}
            </div>
          )}
        </div>

        <button className="submit-btn" type="submit" disabled={submitting}>
          {id ? "Save Changes" : "Create Task"}
        </button>
      </form>
    </LocalizationProvider>
  );
}

export default TaskForm;
