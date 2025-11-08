import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import userIcon from "../images/user-2.png";
import api from "../services/api";
import "./Admin.css";

function Admin_Dashboard({ setActive }) {
  const [stats, setStats] = useState({ userCount: 0, totalPoints: 0, disposalKgWeek: [], wasteStatus: { fullPercent: 0 } });
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [s, u, t] = await Promise.all([
          api.getDashboardStats(),
          api.getUsers(),
          api.getTransactions()
        ]);
        if (!mounted) return;
        setStats(s);
        setUsers(u);
        setTransactions(t);
      } catch (e) {
        setError('Failed to load dashboard');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const barData = stats.disposalKgWeek.length ? stats.disposalKgWeek : [
    { day: 'M', waste: 0 }, { day: 'T', waste: 0 }, { day: 'W', waste: 0 }, { day: 'T', waste: 0 }, { day: 'F', waste: 0 }, { day: 'S', waste: 0 }, { day: 'S', waste: 0 }
  ];

  const pieData = [
    { name: 'Full', value: stats.wasteStatus.fullPercent },
    { name: 'Available', value: 100 - stats.wasteStatus.fullPercent }
  ];

  // Derive student collections: top recent or highest points
  const studentCollections = users
    .map(u => ({ id: u.uid || u.id, name: `${u.name}`, course: u.course, points: `${u.points} pts` }))
    .slice(0, 10);

  const recentActivities = transactions.slice(0, 10).map(tx => `${tx.rewardName} redeemed by user ${tx.userId}`);

  const COLORS = ["#0C3C01", "#A2AC82"];

  return (
    <div className="dashboard-container-inner">
  <h2 className="welcome-text">Welcome, Administrator!</h2>
  {loading && <p style={{marginTop:'4px'}}>Loading dashboard...</p>}
  {error && <p style={{color:'red'}}>{error}</p>}

      {/* === TOP ROW === */}
      <div className="top-row">

        {/* ========================= REGISTERED STUDENTS ========================= */}
        <div className="card card-registered">
          <h3 className="card-title">Registered Users</h3>
          <div className="user-body">
            <span className="user-number">{stats.userCount}</span>
            <img src={userIcon} alt="User Icon" className="user-img" />
          </div>
        </div>



      {/* ========================= BAR GRAPH STUDENT CONTRIBUTES  ========================= */}
        <div className="card">
          <h3 className="card-title">Student Contributes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="waste" fill="#0C3C01" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>



        {/* ========================= WASTE STATUS ULTRASONIC SENSOR  ========================= */}
        <div className="card">
          <h3 className="card-title">Waste Status</h3>
          <div className="pie-body">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <p className="pie-percent">{stats.wasteStatus.fullPercent}% Full</p>
          </div>
        </div>
      </div>




      {/* === SECOND ROW === */}
      <div className="second-row">
        {/* ========================= STUDENT COLLECTIONS ========================= */}
        <div className="card">
          <div className="card-title-row">
            <h3 className="card-title">Student Collections</h3>
            <button className="see-all-btn" onClick={() => setActive("users")}>
              See More
            </button>
          </div>
          <div className="table-header-row">
            <span>UID</span>
            <span>Name</span>
            <span>Points</span>
          </div>
          {/* Show only 3 rows */}
          {studentCollections.slice(0, 3).map((student, index) => (
            <div className="table-row" key={index}>
              <span>{student.id}</span>
              <span>{student.name} {student.course ? `— ${student.course}` : ''}</span>
              <span>{student.points}</span>
            </div>
          ))}
        </div>



        {/* ========================= RECENT ACTIVITIES ========================= */}
        <div className="card card-activities">
          <div className="card-title-row">
            <h3 className="card-title">Recent Activities</h3>
            <button
            className="see-all-btn"
            onClick={() => setActive("activities")}
          >
            See More
          </button>
          </div>
          <hr className="activity-line" />
          {/* Limit to 3 notifications */}
          {recentActivities.slice(0, 3).map((activity, index) => (
            <div className="activity-texts" key={index}>
              <p>{activity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin_Dashboard;

