import React from "react";
import SpecialHead from "../../components/SpecialHead/SpecialHead";
import './EditTaskPage.css';
import EditForm from "../../components/EditForm/EditForm";
import { Link } from "react-router-dom";

function EditTaskPage() {
    return(
        <section id="EditTaskPage">
            <div className="container">
                <SpecialHead Heading="Edit Task" />
                <Link to="/tasks" className="arrow-left">
                    <i class="fa-solid fa-arrow-left"></i>
                </Link>
                <EditForm />
            </div>
        </section>
    )
}

export default EditTaskPage;