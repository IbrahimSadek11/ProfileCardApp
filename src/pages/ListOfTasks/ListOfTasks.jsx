import React from "react";
import SpecialHead from "../../components/SpecialHead/SpecialHead";
import TaskTable from "../../components/TaskTable/TaskTable";
import './ListOfTasks.css';

function ListOfTasks(){
    return (
        <section id="ListOfTasks">
            <div className="container">
                <SpecialHead Heading="Tasks" />
                <TaskTable />
            </div>
        </section>
    )
}

export default ListOfTasks;