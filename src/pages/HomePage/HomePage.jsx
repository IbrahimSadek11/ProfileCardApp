import React from "react";
import "./HomePage.css"; 
import homeImage from "../../assets/landing.svg"; 

function HomePage() {
  return (
    <section id="HomePage">
      <div className="container">
        <div className="text-content">
            <h1>Welcome to Taskify</h1>
            <p>
            Taskify is your smart task management solution built to keep you organized and
            productive. Whether you're tracking personal goals or collaborating with your team,
            Taskify helps you create, assign, and monitor tasks with ease.  
            Visualize progress through interactive dashboards, manage priorities, and stay on top
            of deadlines — all in one place.  
            Get started today and simplify the way you work!
            </p>
        </div>
        <div className="image">
          <img src={homeImage} alt="Home illustration" />
        </div>
      </div>
    </section>
  );
}

export default HomePage;
