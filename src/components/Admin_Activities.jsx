import React from "react";
import "./Admin.css";

function Admin_Activities() {
  const activities = [
    {
      id: 1,
      message:
        "Runehart, Aaron Lysander Kyle successfully claimed their rewards.",
    },
    {
      id: 2,
      message:
        "The waste bin’s capacity has reached its maximum limit. Please initiate a pickup immediately.",
    },
    {
      id: 3,
      message: "Montenegro, Jericho Jay successfully claimed their rewards.",
    },
  ];

  return (
    <div className="dashboard-container-inner">
      <h2 className="section-title">Recent Activities</h2>
      <div className="activity-container">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-row">
            <p>{activity.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin_Activities;
