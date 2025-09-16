import React, { useState } from "react";
import './CreateForm.css';
import { useDispatch } from "react-redux";
import { added } from "../../features/tasks/tasksSlice";
import { useNavigate } from "react-router-dom";

function CreateForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    assignee: '',
    priority: '',
    date: '',
    status: 'Pending',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(added({
      name: form.name,
      description: form.description,
      date: form.date,
      assignee: form.assignee,
      priority: form.priority,
      status: form.status,
    }));

    navigate('/tasks');
  };

  return (
    <form className="CreateForm" onSubmit={onSubmit}>
      <div className="TaskSubject">
        <label htmlFor="task">Task Subject:</label>
        <input
          type="text"
          className="task"
          placeholder="Enter Task Subject..."
          name="name"
          value={form.name}
          onChange={onChange}
          required
        />
      </div>

      <div className="TaskDescription">
        <label htmlFor="description">Task Description:</label>
        <textarea
          className="description"
          name="description"
          value={form.description}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <div className="AssignTaskSection">
          <label>Assign task to:</label>
          <select name="assignee" value={form.assignee} onChange={onChange}>
            <option value="">-- Select User --</option>
            <option value="Ibrahim">Ibrahim</option>
            <option value="Marwa">Marwa</option>
            <option value="Farhan">Farhan</option>
          </select>
        </div>

        <div className="TaskPriority">
          <label>Task Priority:</label>
          <select name="priority" value={form.priority} onChange={onChange}>
            <option value="">-- Select Priority --</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="Deadline">
          <label>Task Deadline:</label>
          <input type="date" name="date" value={form.date} onChange={onChange} />
        </div>
      </div>

      <button type="submit">Create Task</button>
    </form>
  );
}

export default CreateForm;
