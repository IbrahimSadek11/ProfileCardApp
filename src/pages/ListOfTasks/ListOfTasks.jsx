import React from "react";
import SpecialHead from "../../components/SpecialHead/SpecialHead";
import TaskTable from "../../components/TaskTable/TaskTable";
import './ListOfTasks.css';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FallBack from "../../components/FallBack/FallBack";
import NotFound from "../NotFound/NotFound";

function ListOfTasks() {
  const { currentUser, profiles } = useSelector((s) => s.auth);
  const { id } = useParams();

  if (currentUser?.role === "user" && id && String(currentUser.id) !== String(id)) {
    return (
      <section id="ListOfTasks">
        <div className="container">
          <FallBack message="Access denied: you can't access this page." />
        </div>
      </section>
    );
  }

  let headingText;
  
  if (currentUser?.role === "user") {
    headingText = `My Tasks`;
  } else if (currentUser?.role === "admin") {
    if (id) {
      const profile = profiles.find((p) => String(p.id) === String(id));
      if (!profile) {
        return (
          <section id="ListOfTasks">
            <div className="container">
              <NotFound message="This profile does not exist" />
            </div>
          </section>
        );
      }
      headingText = `Tasks of ${profile.name}`;
    } else {
      headingText = "All Tasks";
    }
  }

  return (
    <section id="ListOfTasks">
      <div className="container">
        <div className="Adjusted-Title">
            <SpecialHead Heading={headingText} /> 
        </div>
        <TaskTable />
      </div>
    </section>
  );
}

export default ListOfTasks;
