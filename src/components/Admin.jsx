// src/components/Admin.jsx
import React, { useState, useEffect } from "react";
import "./Admin.css";
import { Menu, X } from "lucide-react"; // Icons for sidebar toggle (open/close)

// ========================= IMAGES =========================
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

// ========================= COMPONENT IMPORTS =========================
import AdminDashboard from "./Admin_Dashboard";
import AdminUserManagement from "./Admin_UserManagement";
import AdminActivities from "./Admin_Activities";
import AdminRewards from "./Admin_Rewards";
import AdminRedeem from "./Admin_Redeem";
import AdminTransactions from "./Admin_Transactions";


// ========================= NAVIGATION ITEMS =========================
// Each item has an ID (used for navigation), label, and two icon versions (default & active)
const navItems = [
  { id: "dashboard", label: "DASHBOARD", icons: [home1, home2] },
  { id: "users", label: "USERS", icons: [user1, user2] },
  { id: "activities", label: "ACTIVITIES", icons: [activity1, activity2] },
  { id: "rewards", label: "REWARDS", icons: [reward1, reward2] },
  { id: "redeem", label: "REDEEM", icons: [reward1, reward2] }, 
  { id: "transactions", label: "TRANSACTIONS", icons: [activity1, activity2] }, 
];

// ========================= MAIN ADMIN COMPONENT =========================
const Admin = () => {
  // Sidebar and navigation states
  const [isOpen, setIsOpen] = useState(true); // Sidebar open/close
  const [hovered, setHovered] = useState(""); // Track which menu item is hovered
  const [active, setActive] = useState("dashboard"); // Track current active page
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Responsive layout flag

  // ========================= WINDOW RESIZE HANDLER =========================
  useEffect(() => {
    // Automatically detect screen size changes
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ========================= PAGE NAVIGATION HANDLER =========================
  const goToSection = (id) => {
    setActive(id); // Switch active section
    if (isMobile) setIsOpen(false); // Auto-close sidebar when on mobile
  };

  // ========================= PAGE RENDERER =========================
  // Renders the correct component depending on which menu item is active
  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return <AdminDashboard setActive={goToSection} />; // Pass setActive so child can navigate
      case "users":
        return <AdminUserManagement setActive={goToSection} />;
      case "activities":
        return <AdminActivities setActive={goToSection} />;
      case "rewards":
        return <AdminRewards setActive={goToSection} />;
      case "redeem":
        return <AdminRedeem />; 
      case "transactions":
        return <AdminTransactions />; 
      default:
        return <AdminDashboard setActive={goToSection} />;
    }
  };

  // ========================= MAIN LAYOUT =========================
  return (
    <div className="admin-root">
      {/* ========================= HEADER SECTION ========================= */}
      <header className="admin-header">
        <div className="header-left">
          {/* Sidebar toggle button (hamburger / X) */}
          <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X color="#fff" /> : <Menu color="#fff" />}
          </button>

          {/* Logo and system title */}
          <img src={esaveLogo} alt="Logo" className="header-logo" />
          <h1 className="header-title">eSave</h1>
        </div>

        {/* Right-side buttons (login/user) */}
        <div className="header-right">
          <button className="login-btn">
            <img src={loginIcon} alt="Login" className="login-icon" />
          </button>

          <button className="user-btn">
            <img src={user1} alt="User" className="user-profile-icon" />
          </button>
        </div>
      </header>

      {/* ========================= SIDEBAR + MAIN CONTENT ========================= */}
      <div className={`layout ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
        {/* ========================= SIDEBAR MENU ========================= */}
        <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
          <nav className="sidebar-menu">
            {navItems.map((item) => {
              const isActive = active === item.id; // Check if current menu is active
              const isHovered = hovered === item.id; // Check if currently hovered
              const imgSrc = isActive || isHovered ? item.icons[1] : item.icons[0]; // Use hover/active icon

              return (
                <a
                  key={item.id}
                  href="#!"
                  className={`menu-item ${isActive ? "active" : ""}`}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered("")}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent page refresh
                    goToSection(item.id); // Navigate to selected section
                  }}
                >
                  <img src={imgSrc} alt={item.label} className="menu-icon" />
                  {isOpen && <span className="menu-label">{item.label}</span>}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* ========================= SIDEBAR OVERLAY (MOBILE ONLY) ========================= */}
        {isMobile && isOpen && (
          <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
        )}

        {/* ========================= MAIN CONTENT AREA ========================= */}
        <main className="main">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Admin;
