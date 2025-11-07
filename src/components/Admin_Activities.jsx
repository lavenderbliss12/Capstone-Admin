
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
      <div className="card card-activities">
        <div className="card-inner">
          <div className="card-title-row">
            <h3 className="card-title">Recent Activities</h3>
          </div>
          <hr className="activity-line" />

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
      </div>
    </div>
  );
}

export default Admin_Activities;
