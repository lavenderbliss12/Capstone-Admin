
import React, { useEffect, useState } from "react";
import "./Admin.css";
import api from "../services/api";

function Admin_Activities({ activities = [], setActive }) {
  // Combine provided activities with dynamic ones (transactions & disposals)
  const [dynamic, setDynamic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [tx, disposals] = await Promise.all([
          api.getTransactions(),
          api.getDisposals()
        ]);
        if (!mounted) return;
        const txEvents = tx.map(t => ({
          id: `tx-${t.id}`,
          message: `${t.rewardName} redeemed (−${t.pointsUsed} pts) by user ${t.userId}`,
          createdAt: t.date
        }));
        const disposalEvents = disposals.map(d => ({
          id: `bw-${d.id}`,
          message: `Biowaste disposal ${d.kg}kg (+${d.pointsEarned} pts) by user ${d.userId}`,
          createdAt: d.createdAt
        }));
        setDynamic([...txEvents, ...disposalEvents]);
      } catch (e) {
        setError('Failed to load dynamic activities');
      } finally { setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  const sorted = [...activities, ...dynamic].sort((a, b) => {
    if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
    return String(b.id).localeCompare(String(a.id));
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
            {loading && <p>Loading activities...</p>}
            {error && <p style={{color:'red'}}>{error}</p>}
            {!loading && !error && sorted.length > 0 ? (
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
