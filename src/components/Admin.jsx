
import React, { useState, useEffect } from "react";
import "./Admin.css";
import { Menu, X } from "lucide-react";

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
import transaction1 from "../images/transaction-1.png";
import transaction2 from "../images/transaction-2.png";


// ========================= COMPONENT IMPORTS =========================
import AdminDashboard from "./Admin_Dashboard";
import AdminUserManagement from "./Admin_UserManagement";
import AdminActivities from "./Admin_Activities";
import AdminRewards from "./Admin_Rewards";
import AdminTransactions from "./Admin_Transactions";
import api from "../services/api";

// ========================= SIDEBAR ITEMS =========================
const navItems = [
  { id: "dashboard", label: "DASHBOARD", icons: [home1, home2] },
  { id: "users", label: "USERS", icons: [user1, user2] },
  { id: "activities", label: "ACTIVITIES", icons: [activity1, activity2] },
  { id: "rewards", label: "REWARDS", icons: [reward1, reward2] },
  { id: "transactions", label: "TRANSACTIONS", icons: [transaction1, transaction2] },
];

// ========================= MAIN ADMIN COMPONENT =========================
const Admin = () => {
  // Sidebar & layout states
  const [isOpen, setIsOpen] = useState(true);
  const [hovered, setHovered] = useState("");
  const [active, setActive] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // ========================= SHARED ACTIVITIES =========================
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [tx, disposals] = await Promise.all([
          api.getTransactions(),
          api.getDisposals()
        ]);
        if (!mounted) return;
        const txEvents = tx.slice(0, 10).map(t => ({ id: `tx-${t.id}`, message: `${t.rewardName} redeemed (−${t.pointsUsed} pts) by user ${t.userId}`, createdAt: t.date }));
        const disposalEvents = disposals.slice(0, 10).map(d => ({ id: `bw-${d.id}`, message: `Biowaste disposal ${d.kg}kg (+${d.pointsEarned} pts) by user ${d.userId}`, createdAt: d.createdAt }));
        setActivities([...txEvents, ...disposalEvents]);
      } catch (e) {
        console.error('Failed to load activities', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Sort newest to oldest every render
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // ========================= HANDLE WINDOW RESIZE =========================
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ========================= PAGE NAVIGATION HANDLER =========================
  const goToSection = (id) => {
    setActive(id);
    if (isMobile) setIsOpen(false);
  };

  // ========================= PAGE RENDERER =========================
  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return (
          <AdminDashboard
            setActive={goToSection}
            activities={sortedActivities}
            setActivities={setActivities}
          />
        );
      case "users":
        return <AdminUserManagement setActive={goToSection} />;
      case "activities":
        return (
          <AdminActivities
            setActive={goToSection}
            activities={sortedActivities}
          />
        );
      case "rewards":
        return <AdminRewards setActive={goToSection} />;
      default:
        return (
          <AdminDashboard
            setActive={goToSection}
            activities={sortedActivities}
            setActivities={setActivities}
          />
        );
        case "transactions":
        return (
          <AdminTransactions
            setActive={goToSection}
            activities={sortedActivities}
          />
        );
    }
  };

  // ========================= MAIN LAYOUT =========================
  return (
    <div className="admin-root">
      {/* ========================= HEADER ========================= */}
      <header className="admin-header">
        <div className="header-left">
          {/* Sidebar toggle (hamburger / X) */}
          <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X color="#fff" /> : <Menu color="#fff" />}
          </button>

          {/* Logo and system title */}
          <img src={esaveLogo} alt="Logo" className="header-logo" />
          <h1 className="header-title">eSave</h1>
        </div>

        {/* Right-side buttons */}
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
              const isActive = active === item.id;
              const isHovered = hovered === item.id;
              const imgSrc =
                isActive || isHovered ? item.icons[1] : item.icons[0];

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

        {/* ========================= SIDEBAR OVERLAY (MOBILE) ========================= */}
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

