import React from "react";
import "./TaskTable.css";
import CreateBtn from "../Create-Btn/Create-Btn";
import { Link } from "react-router-dom";

const tasks = [
  {
    name: "Fix Login Bug",
    date: "10 May 2022",
    assignee: "Ahmed",
    priority: "High",
    team: ["team-01.png", "team-02.png"],
    status: "Pending",
  },
  {
    name: "Write Documentation",
    date: "12 Oct 2021",
    assignee: "Sara",
    priority: "Medium",
    team: ["team-03.png"],
    status: "In Progress",
  },
  {
    name: "UI Redesign",
    date: "05 Sep 2021",
    assignee: "Ali",
    priority: "Low",
    team: ["team-01.png", "team-04.png"],
    status: "Completed",
  },
  {
    name: "Database Migration",
    date: "22 May 2021",
    assignee: "Maya",
    priority: "High",
    team: ["team-02.png", "team-03.png"],
    status: "Completed",
  },
  {
    name: "Client Meeting",
    date: "24 May 2021",
    assignee: "Omar",
    priority: "High",
    team: ["team-01.png"],
    status: "Rejected",
  },
  {
    name: "Deploy API",
    date: "01 Mar 2021",
    assignee: "Nour",
    priority: "Medium",
    team: ["team-02.png", "team-03.png", "team-04.png"],
    status: "Completed",
  },
];

const TaskTable = () => {
  return (
    <div className="task-table-section">
      <div className="tool-row">
          <h2>Tasks</h2>
          <CreateBtn navigate="/Task/Create"/>
      </div>
      <div className="task-table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <td>ID</td>
              <td>Task</td>
              <td>Deadline</td>
              <td>Assignee</td>
              <td>Priority</td>
              <td>Status</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{task.name}</td>
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
                  <Link to="/Task/Edit">
                    <i class="fa-solid fa-pen" ></i>
                  </Link>
                  <button type="submit" className="delete-btn"><i class="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;