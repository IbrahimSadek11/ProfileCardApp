import React from "react";
import './CreateTaskPage.css';
import CreateForm from "../../components/CreateForm/CreateForm";
import SpecialHead from "../../components/SpecialHead/SpecialHead";
import { Link } from "react-router-dom";

function CreateTaskPage (){
    return (
        <section id="CreateTaskPage">
            <div className="container">
                <SpecialHead Heading="Create Task" />
                <Link to="/tasks" className="arrow-left">
                    <i class="fa-solid fa-arrow-left"></i>
                </Link>
                <CreateForm />
            </div>
        </section>
    )
}

export default CreateTaskPage;