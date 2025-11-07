// src/App.jsx
import React, { useEffect, useState } from "react";
import Admin from "./components/Admin";
import AdminDashboard from "./components/Admin_Dashboard";

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then((res) => res.json())
      .then((result) => setData(result.message))
      .catch((err) => console.error("Error fetching from NestJS:", err));
  }, []);

  return (
    <Admin>
      <AdminDashboard />
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>React + NestJS Connection Test</h1>
        <p>{data || "Waiting for response..."}</p>
      </div>
    </Admin>
  );
}

export default App;
