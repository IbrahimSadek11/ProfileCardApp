import React from "react";
import './ManageTaskPage.css';
import TaskForm from "../../components/TaskForm/TaskForm";
import SpecialHead from "../../components/SpecialHead/SpecialHead";
import { Link, useParams } from "react-router-dom";

function ManageTaskPage (){
  const { id } = useParams();
  return (
    <section id={id ? "EditTaskPage" : "CreateTaskPage"}>
      <div className="container">
        <SpecialHead Heading={id ? "Edit Task" : "Create Task"}/>
        <Link to="/tasks" className="arrow-left">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <TaskForm />
      </div>
    </section>
  );
}

export default ManageTaskPage;
