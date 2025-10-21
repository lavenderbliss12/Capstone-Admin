// src/components/Admin_Activities.jsx
import React from "react";
import "./Admin.css";

function Admin_Activities() {
  return (
    <div className="dashboard-container-inner">
      <h2 className="welcome-text">Activities</h2>
      <div className="card">
        <h3 className="card-title">Recent Activity Logs</h3>
        <p>List of all recent waste collection and reward redemption activities.</p>
      </div>
    </div>
  );
}

export default Admin_Activities;
