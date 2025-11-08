import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./Admin.css";

function Admin_Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const tx = await api.getTransactions();
        if (mounted) setTransactions(tx);
      } catch (e) {
        if (mounted) setError('Failed to load transactions');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const [viewing, setViewing] = useState(null);

  return (
    <div className="transaction-container">
      <h2 className="welcome-text">Transaction</h2>

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
            {loading && (
              <tr><td colSpan={7}>Loading...</td></tr>
            )}
            {error && (
              <tr><td colSpan={7} style={{color:'red'}}>{error}</td></tr>
            )}
            {!loading && !error && transactions.length === 0 && (
              <tr><td colSpan={7}>No transactions found.</td></tr>
            )}
            {!loading && !error && transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{tx.userId}</td>
                <td>{tx.userId}</td>
                <td>{tx.rewardName}</td>
                <td>{tx.pointsUsed}</td>
                <td>{tx.date && String(tx.date).split('T')[0].replace(/-/g,'/')}</td>
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
