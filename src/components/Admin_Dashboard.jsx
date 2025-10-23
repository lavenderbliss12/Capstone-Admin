// src/components/Admin_Dashboard.jsx
import React from "react";
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
import "./Admin.css";

function Admin_Dashboard({ setActive }) {
  const barData = [
    { day: "M", waste: 40 },
    { day: "T", waste: 50 },
    { day: "W", waste: 30 },
    { day: "T", waste: 70 },
    { day: "F", waste: 60 },
    { day: "S", waste: 45 },
    { day: "S", waste: 100 },
  ];

  const pieData = [
    { name: "Full", value: 70 },
    { name: "Available", value: 30 },
  ];

  const studentCollections = [
    { id: "202510177", name: "John Doe", points: 0.1 },
    { id: "202510155", name: "Jane Smith", points: 30 },
    { id: "202510100", name: "Jean Do", points: 0.35 },
    { id: "202510199", name: "Mikaela Cruz", points: 20 },
  ];

  const recentActivities = [
    "The waste bin’s capacity has reached its maximum limit. Please initiate a pickup immediately.",
    "Runehart, Aiden Laurenzo Kurt successfully claimed their rewards.",
    "Maria Santos claimed her eco points rewards.",
    "John Doe contributed biodegradable waste to Bin #3.",
  ];

  const COLORS = ["#0C3C01", "#A2AC82"];

  return (
    <div className="dashboard-container-inner">
      <h2 className="welcome-text">Welcome, Administrator!</h2>

      {/* === TOP ROW === */}
      <div className="top-row">

        {/* ========================= REGISTERED STUDENTS ========================= */}
        <div className="card">
          <h3 className="card-title">Registered Users</h3>
          <div className="user-body">
            <span className="user-number">254</span>
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
            <p className="pie-percent">70% Full</p>
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
            <span>ID</span>
            <span>Name</span>
            <span>Points</span>
          </div>
          {/* Show only 3 rows */}
          {studentCollections.slice(0, 3).map((student, index) => (
            <div className="table-row" key={index}>
              <span>{student.id}</span>
              <span>{student.name}</span>
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

