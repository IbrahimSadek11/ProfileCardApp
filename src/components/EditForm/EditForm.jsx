import React, { useMemo, useState, useEffect } from "react";
import './EditForm.css';
import { useDispatch, useSelector } from "react-redux";
import { updated } from "../../features/tasks/tasksSlice";
import { useNavigate, useParams } from "react-router-dom";

function EditForm() {
  const { id } = useParams();
  const task = useSelector(s => s.tasks.items.find(t => String(t.id) === String(id)));

  const [form, setForm] = useState(() => ({
    name: '',
    description: '',
    assignee: '',
    priority: '',
    date: '',
    status: '',
  }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (task) {
      setForm({
        name: task.name,
        description: task.description,
        assignee: task.assignee,
        priority: task.priority,
        date: task.date,
        status: task.status,
      });
    }
  }, [task]);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(updated({ id, changes: { ...form } }));
    navigate('/tasks'); 
  };

  if (!task) {
    return <p style={{ padding: 16 }}>Task not found.</p>;
  }

  return (
    <form className="EditForm" onSubmit={onSubmit}>
      <div className="TaskSubject">
        <label>Task Subject:</label>
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
        <label>Task Description:</label>
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
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <div className="Deadline">
          <label>Task Deadline:</label>
          <input type="date" name="date" value={form.date} onChange={onChange} />
        </div>
        <div className="Status">
          <label>Task Status:</label>
          <select name="status" value={form.status} onChange={onChange}>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <button type="submit">Save Changes</button>
    </form>
  );
}

export default EditForm;
