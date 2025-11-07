import React, { useState } from "react";
import "./Admin.css";

function Admin_Transactions() {
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

  const [viewing, setViewing] = useState(null);

  return (
    <div className="transaction-container">
      <h2 className="welcome-text"> Transaction </h2>

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

export default Admin_Transactions;
