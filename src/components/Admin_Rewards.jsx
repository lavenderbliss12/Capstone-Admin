
import React, { useState } from "react";
import "./Admin.css";

function Admin_Rewards() {
  const [rewards, setRewards] = useState([
    {
      id: 1,
      thumbnail: "",
      name: "10 copies of bond paper",
      points: 100,
      stock: 20,
      available: true,
    },
    {
      id: 2,
      thumbnail: "",
      name: "1pc Black ballpen",
      points: 50,
      stock: 0,
      available: false,
    },
  ]);

  const [viewingReward, setViewingReward] = useState(null);
  const [editingReward, setEditingReward] = useState(null);
  const [confirmDeleteReward, setConfirmDeleteReward] = useState(null);
  const [addingReward, setAddingReward] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter by search
  const filteredRewards = rewards.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleAvailability = (id) => {
    setRewards((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, available: !r.available } : r
      )
    );
  };

  const handleDelete = () => {
    setRewards((prev) =>
      prev.filter((r) => r.id !== confirmDeleteReward.id)
    );
    setConfirmDeleteReward(null);
  };

  const handleSaveEdit = (edited) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === edited.id ? edited : r))
    );
    setEditingReward(null);
  };

  const handleAddReward = (newReward) => {
    setRewards((prev) => [
      { ...newReward, id: Date.now() },
      ...prev,
    ]);
    setAddingReward(false);
  };

  return (
    <div className="reward-catalog-container">
      <h2 className="welcome-text">Reward Catalog</h2>
      {/* Header */}
      <div className="reward-header" 
      style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" }}>
        {/* <h3 className="card-title">Reward Catalog</h3> */}
        <div className="reward-controls">
          <button className="add-btn" onClick={() => setAddingReward(true)}>
            + Add New Reward
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Search Rewards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>


      {/* Table */}
      <div className="reward-table-wrapper">
        <table className="reward-table">
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>Reward Name</th>
              <th>Points Required</th>
              <th>Stock</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRewards.length > 0 ? (
              filteredRewards.map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.thumbnail ? (
                      <img src={r.thumbnail} alt="thumb" width="50" />
                    ) : (
                      <div className="no-thumb">No Image</div>
                    )}
                  </td>
                  <td>{r.name}</td>
                  <td>{r.points} points</td>
                  <td>{r.stock}</td>
                  <td>
                    <div className="toggle-switch">
                      <button
                        className={`toggle-btn ${r.available ? "on" : "off"}`}
                        onClick={() => handleToggleAvailability(r.id)}
                      >
                        {r.available ? "on" : "off"}
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => setViewingReward(r)}
                      className="action-btn"
                    >
                      view
                    </button>
                    <button
                      onClick={() => setEditingReward(r)}
                      className="action-btn"
                    >
                      edit
                    </button>
                    <button
                      onClick={() => setConfirmDeleteReward(r)}
                      className="action-btn delete"
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No rewards found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewingReward && (
        <div className="reward-modal-overlay">
          <div className="reward-modal-card">
            <h3>Reward Details</h3>
            <div className="reward-modal-body">
              <p><strong>Name:</strong> {viewingReward.name}</p>
              <p><strong>Points Required:</strong> {viewingReward.points}</p>
              <p><strong>Stock:</strong> {viewingReward.stock}</p>
              <p>
                <strong>Availability:</strong>{" "}
                {viewingReward.available ? "Available" : "Unavailable"}
              </p>
            </div>
            <div className="reward-modal-actions">
              <button
                onClick={() => setViewingReward(null)}
                className="reward-btn reward-btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingReward && (
        <div className="reward-modal-overlay">
          <div className="reward-modal-card">
            <h3>Edit Reward</h3>
            <RewardForm
              reward={editingReward}
              onSave={handleSaveEdit}
              onCancel={() => setEditingReward(null)}
            />
          </div>
        </div>
      )}

      {/* Add Reward Modal */}
      {addingReward && (
        <div className="reward-modal-overlay">
          <div className="reward-modal-card">
            <h3>Add New Reward</h3>
            <RewardForm
              onSave={handleAddReward}
              onCancel={() => setAddingReward(false)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDeleteReward && (
        <div className="reward-modal-overlay">
          <div className="reward-modal-card">
            <h3>Confirm Delete</h3>
            <div className="reward-modal-body">
              <p>
                Are you sure you want to delete{" "}
                <strong>{confirmDeleteReward.name}</strong>?
              </p>
            </div>
            <div className="reward-modal-actions">
              <button
                onClick={handleDelete}
                className="reward-btn reward-btn-danger"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDeleteReward(null)}
                className="reward-btn reward-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RewardForm({ reward = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: reward.name || "",
    points: reward.points || "",
    stock: reward.stock || "",
    available: reward.available ?? true,
    thumbnail: reward.thumbnail || "",
    id: reward.id || null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setForm({
      name: "",
      points: "",
      stock: "",
      available: true,
      thumbnail: "",
    });
  };

  return (
    <form className="reward-form-grid" onSubmit={handleSubmit}>
      <label>
        Reward Name
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Points Required
        <input
          name="points"
          type="number"
          value={form.points}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Stock
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Thumbnail URL
        <input
          name="thumbnail"
          value={form.thumbnail}
          onChange={handleChange}
        />
      </label>

      <label>
        Availability
        <select
          name="available"
          value={form.available}
          onChange={(e) =>
            setForm((f) => ({ ...f, available: e.target.value === "true" }))
          }
        >
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
      </label>

      <div className="reward-modal-actions">
        <button type="submit" className="reward-btn reward-btn-primary">Save</button>
        <button type="button" onClick={onCancel} className="reward-btn reward-btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default Admin_Rewards;
