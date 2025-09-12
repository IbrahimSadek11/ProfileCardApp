import React from "react";
import './CreateTaskPage.css';
import CreateForm from "../../components/CreateForm/CreateForm";
import SpecialHead from "../../components/SpecialHead/SpecialHead";

function CreateTaskPage (){
    return (
        <section id="CreateTaskPage">
            <div className="container">
                <SpecialHead Heading="Create Task" />
                <CreateForm />
            </div>
        </section>
    )
}

export default CreateTaskPage;