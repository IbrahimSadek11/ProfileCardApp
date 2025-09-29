import React from "react";
import SpecialHead from "../../components/SpecialHead/SpecialHead";
import TaskTable from "../../components/TaskTable/TaskTable";
import './ListOfTasks.css';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FallBack from "../../components/FallBack/FallBack";

function ListOfTasks() {
  const { currentUser, profiles } = useSelector((s) => s.auth);
  const { id } = useParams();

  let headingText = "Tasks";

  if (currentUser?.role === "user") {
    const profile = profiles.find((p) => String(p.id) === String(currentUser.id));
    headingText = `Tasks of ${profile.name}`;
  } else if (currentUser?.role === "admin") {
    if (id) {
      const profile = profiles.find((p) => String(p.id) === String(id));
      if (!profile) {
        return (
          <section id="ListOfTasks">
            <div className="container">
              <FallBack message="❌ This profile does not exist" />
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
        <SpecialHead Heading={headingText} />
        <TaskTable />
      </div>
    </section>
  );
}

export default ListOfTasks;
