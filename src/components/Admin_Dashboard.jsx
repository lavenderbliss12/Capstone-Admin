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
  // ======== CHART DATA ========
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

  const COLORS = ["#0C3C01", "#A2AC82"];

  // ======== STUDENT COLLECTIONS ========
  const studentCollections = [
    { id: "202510019", surname: "Lazlo", name: "Heinrey Alles", email: "lazlo@example.com", course: "BSBM", dateCreated: "2025/01/01", points: "100 pts" },
    { id: "202509030", surname: "Riverdale", name: "Chandler Zachary", email: "riverdale@example.com", course: "BSOA", dateCreated: "2025/01/01", points: "15 pts" },
    { id: "202510010", surname: "Weinston", name: "Rylo Alexandrius", email: "weinston@example.com", course: "BSJOURN", dateCreated: "2025/01/01", points: "0.50 pts" },
    { id: "202509001", surname: "Jeon", name: "Jeong Woo", email: "jeon@example.com", course: "BSPSYCH", dateCreated: "2025/09/01", points: "99 pts" },
    { id: "202512008", surname: "Devonshire", name: "Luke Iverson", email: "luke.dev@example.com", course: "BSIT", dateCreated: "2025/02/28", points: "8 pts" },
    { id: "202512009", surname: "Devonshire", name: "Liam Oleander", email: "liam.dev@example.com", course: "BSIT", dateCreated: "2025/02/28", points: "8 pts" },
    { id: "201708019", surname: "Montenegro", name: "Jericho Jay", email: "meyer@example.com", course: "BSBA", dateCreated: "2017/01/09", points: "0 pts" },
    { id: "202510101", surname: "Lennox", name: "McKenzie Ralph", email: "lennox@example.com", course: "BSOA", dateCreated: "2025/01/01", points: "7 pts" },
    { id: "202009001", surname: "Runehart", name: "Aaron Lysander Kyle", email: "aaron.r@example.com", course: "BSHM", dateCreated: "2020/01/01", points: "20.15 pts" },
    { id: "202109001", surname: "Runehart", name: "Aiden Laurenzo Kurt", email: "aiden.r@example.com", course: "BSHM", dateCreated: "2021/01/01", points: "20.20 pts" },
  ];

  // ======== ALL ACTIVITIES (FULL LIST) ========
  const allActivities = [
    "The waste bin’s capacity has reached its maximum limit. Please initiate a pickup immediately.",
    "Runehart, Aiden Laurenzo Kurt successfully claimed their rewards.",
    "Runehart, Aaron Lysander Kyle successfully claimed their rewards.",
    // Future new activities will appear at the top when added
  ];

  // ======== GET 3 MOST RECENT ========
  const recentActivities = allActivities.slice(0, 3);

  return (
    <div className="dashboard-container-inner">
      <h2 className="welcome-text">Welcome, Administrator!</h2>

      {/* === TOP ROW === */}
      <div className="top-row">

        {/* Registered Users */}
        <div className="card">
          <h3 className="card-title">Registered Users</h3>
          <div className="user-body">
            <span className="user-number">254</span>
            <img src={userIcon} alt="User Icon" className="user-img" />
          </div>
        </div>

        {/* Student Contributes Chart */}
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

        {/* Waste Status */}
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

        {/* Student Collections */}
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

          {/* Show only first 3 students */}
          {studentCollections.slice(0, 3).map((student, index) => (
            <div className="table-row" key={index}>
              <span>{student.id}</span>
              <span>{student.name}</span>
              <span>{student.points}</span>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
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
          {/* Show top 3 most recent */}
          {recentActivities.map((activity, index) => (
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
