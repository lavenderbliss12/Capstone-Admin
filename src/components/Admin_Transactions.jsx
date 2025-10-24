// src/components/Admin_Activities.jsx
import React from "react";
import "./Admin.css";

function Admin_Activities({ activities = [], setActive }) {
  // sort newest first so the first lines are the most recent
  const sorted = [...activities].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return b.id - a.id;
  });

  return (
    <div className="dashboard-container-inner">
      <div className="activity-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="section-title">All Recent Activities</h2>
        
        {/* <div>
          <button className="see-all-btn" onClick={() => setActive("dashboard")}>
            Back to Dashboard
          </button>
        </div>
         */} 

      </div>

      <div className="activity-container">
        {sorted.length > 0 ? (
          sorted.map((activity) => (
            <div key={activity.id} className="activity-row">
              <p>{activity.message}</p>
            </div>
          ))
        ) : (
          <p>No activities to show.</p>
        )}
      </div>
    </div>
  );
}

export default Admin_Activities;
