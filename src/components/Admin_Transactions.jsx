import React from "react";
<<<<<<< HEAD
import "./Admin.css";

function Admin_Transactions({ transactions = [], setActive }) {
  // sort newest first so the first lines are the most recent
  const sorted = [...transactions].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return b.id - a.id;
  });

  return (
    <div className="dashboard-container-inner">
      <div className="activity-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="section-title">Transactions</h2>
        
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
          <p>No transactions to show.</p>
        )}
      </div>
    </div>
  );
}

export default Admin_Transactions;
=======

const AdminTransactions = () => {
  return <div>Transactions management</div>;
};

export default AdminTransactions;
>>>>>>> 13f2aad2fcc985767cd992212803252bd5ff1f09
