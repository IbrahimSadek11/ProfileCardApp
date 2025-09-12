import React from "react";
import './CreateForm.css';

function CreateForm() {
  return (
    <form className="CreateForm">
      <div className="TaskSubject">
        <label htmlFor="task">Task Subject:</label>
        <input type="text" className="task" placeholder="Enter Task Subject..."  />
      </div>
      <div className="TaskDescription">
        <label htmlFor="description">Task Description:</label>
        <textarea className="description"></textarea>
      </div>
      <div className="form-group">
        <div className="AssignTaskSection">
          <label htmlFor="description">Assign task to:</label>
          <select>
              <option value="">-- Select User --</option>
              <option value="low">Ibrahim</option>
              <option value="medium">Marwa</option>
              <option value="high">Farhan</option>
          </select>
        </div>
        <div className="TaskPriority">
          <label htmlFor="description">Task Priority:</label>
          <select>
              <option value="">-- Select Priority --</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
          </select>
        </div>
        <div className="Deadline">
          <label htmlFor="description">Task Deadline:</label>
          <input type="date"/>
        </div>
      </div>

      <button type="submit">Create Task</button>
    </form>
  );
}

export default CreateForm;
