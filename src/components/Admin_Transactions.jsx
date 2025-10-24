<<<<<<< Updated upstream
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
=======
import React, { useState } from "react";
import "./Admin.css";
>>>>>>> Stashed changes

function Admin_TransactionManagement() {
  const [transactions, setTransactions] = useState([
    {
      transaction_id: "TXN-20251023001",
      user_id: "U001",
      user_name: "Lazlo Heinrey",
      reward_name: "Eco Bag",
      points_used: 50,
      transaction_date: "2025/10/23",
      status: "Completed"
    },
    {
      transaction_id: "TXN-20251023002",
      user_id: "U002",
      user_name: "Aiden Runehart",
      reward_name: "Water Bottle",
      points_used: 30,
      transaction_date: "2025/10/23",
      status: "Pending"
    },
  ]);

<<<<<<< Updated upstream
export default AdminTransactions;
>>>>>>> 13f2aad2fcc985767cd992212803252bd5ff1f09
=======
  const [viewing, setViewing] = useState(null);

  return (
    <div className="transaction-container">
      <h2 className="page-title">Transaction Management</h2>

      <div className="table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Reference No.</th>
              <th>User ID</th>
              <th>User Name</th>
              <th>Reward</th>
              <th>Points Used</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.transaction_id}>
                <td>{tx.transaction_id}</td>
                <td>{tx.user_id}</td>
                <td>{tx.user_name}</td>
                <td>{tx.reward_name}</td>
                <td>{tx.points_used}</td>
                <td>{tx.transaction_date}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => setViewing(tx)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewing && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Transaction Details</h3>
            <div className="modal-body">
              <p><strong>Reference:</strong> {viewing.transaction_id}</p>
              <p><strong>User:</strong> {viewing.user_name} ({viewing.user_id})</p>
              <p><strong>Reward:</strong> {viewing.reward_name}</p>
              <p><strong>Points Used:</strong> {viewing.points_used}</p>
              <p><strong>Date:</strong> {viewing.transaction_date}</p>
              <p><strong>Status:</strong> {viewing.status}</p>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setViewing(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin_TransactionManagement;
>>>>>>> Stashed changes
