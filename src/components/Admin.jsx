// src/components/Admin.jsx
import React, { useState, useEffect } from "react";
import "./Admin.css";
import { Menu, X } from "lucide-react";

import home1 from "../images/home-1.png";
import home2 from "../images/home-2.png";
import user1 from "../images/user-1.png";
import user2 from "../images/user-2.png";
import activity1 from "../images/activity-1.png";
import activity2 from "../images/activity-2.png";
import reward1 from "../images/reward-1.png";
import reward2 from "../images/reward-2.png";
import esaveLogo from "../images/esave-logo-light.png";
import loginIcon from "../images/login.png";

import Admin_Dashboard from "./Admin_Dashboard";
import Admin_UserManagement from "./Admin_UserManagement";
import Admin_Activities from "./Admin_Activities";
import Admin_Rewards from "./Admin_Rewards";

// SIDEBAR ICONS
const navItems = [
  { id: "dashboard", label: "DASHBOARD", icons: [home1, home2] },
  { id: "users", label: "USERS", icons: [user1, user2] },
  { id: "activities", label: "ACTIVITIES", icons: [activity1, activity2] },
  { id: "rewards", label: "REWARDS", icons: [reward1, reward2] },
];

// SIDEBAR
const Admin = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [hovered, setHovered] = useState("");
  const [active, setActive] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToSection = (id) => {
    setActive(id);
    if (isMobile) setIsOpen(false); // Auto-close sidebar on mobile
  };

  // Dynamically render based on section
  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return <Admin_Dashboard setActive={goToSection} />;
      case "users":
        return <Admin_UserManagement />;
      case "activities":
        return <Admin_Activities />;
      case "rewards":
        return <Admin_Rewards />;
      
    }
  };

  return (
    <div className="admin-root">
      {/* HEADER */}
      <header className="admin-header">
        <div className="header-left">
          <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X color="#fff" /> : <Menu color="#fff" />}
          </button>
          <img src={esaveLogo} alt="Logo" className="header-logo" />
          <h1 className="header-title">eSave</h1>
        </div>

        <div className="header-right">
          <button className="login-btn">
            <img src={loginIcon} alt="Add User" className="login-icon" />
          </button>

          <button className="user-btn">
            <img src={user1} alt="User" className="user-profile-icon" />
          </button>
        </div>
      </header>

      {/* SIDEBAR + MAIN */}
      <div className={`layout ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
        {/* SIDEBAR */}
        <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
          <nav className="sidebar-menu">
            {navItems.map((item) => {
              const isActive = active === item.id;
              const isHovered = hovered === item.id;
              const imgSrc = isActive || isHovered ? item.icons[1] : item.icons[0];
              return (
                <a
                  key={item.id}
                  href="#!"
                  className={`menu-item ${isActive ? "active" : ""}`}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered("")}
                  onClick={(e) => {
                    e.preventDefault();
                    goToSection(item.id);
                  }}
                >
                  <img src={imgSrc} alt={item.label} className="menu-icon" />
                  {isOpen && <span className="menu-label">{item.label}</span>}
                </a>
              );
            })}
          </nav>
        </aside>

        {isMobile && isOpen && (
          <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
        )}

        {/* MAIN CONTENT */}
        <main className="main">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Admin;


