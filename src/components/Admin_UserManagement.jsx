import React, { useState, useEffect, useRef } from "react";
import "./Admin.css";
import regUserLight from "../images/reg-user-1.png";
import regUserDark from "../images/reg-user-2.png";

import sortUpLight from "../images/sort-up-light.png"; //DESCEND Z TO A
import sortUpDark from "../images/sort-up-dark.png";  //DESCEND Z TO A
import sortDownLight from "../images/sort-down-light.png"; //ASCEND A TO Z HOVER
import sortDownDark from "../images/sort-down-dark.png";  //ASCEND A TO Z

import dropLight from "../images/dropdown-1.png";
import dropDark from "../images/dropdown-2.png";
import ellipsisIcon from "../images/ellipsis-1.png";

function Admin_UserManagement() {
  const [filter, setFilter] = useState("Course");
  const [sortOrder, setSortOrder] = useState("asc"); // asc = A-Z ; desc = Z-A
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [students, setStudents] = useState([
    { 
      id: "202510019", 
      surname: "Lazlo", 
      name: "Heinrey Alles", 
      email: "lazlo@example.com", 
      course: "BSBM", 
      dateCreated: "2025/01/01", 
      points: "100 pts"
     },

    { 
      id: "202509030", 
      surname: "Riverdale", 
      name: "Chandler Zachary", 
      email: "riverdale@example.com", 
      course: "BSOA", 
      dateCreated: "2025/01/01",
       points: "15 pts" 
    },
    
    {
     id: "202510010",
     surname: "Weinston", 
     name: "Rylo Alexandrius",
      email: "weinston@example.com", 
      course: "BSJOURN", 
      dateCreated: "2025/01/01", 
      points: "0.50 pts" 
    },

    { 
      id: "202509001", 
      surname: "Jeon", 
      name: "Jeong Woo", 
      email: "jeon@example.com", 
      course: "BSPSYCH", 
      dateCreated: "2025/09/01", 
      points: "99 pts"
    },

    { 
      id: "202512008",
      surname: "Devonshire", 
      name: "Luke Iverson", 
      email: "luke.dev@example.com", 
      course: "BSIT", 
      dateCreated: "2025/02/28", 
      points: "8 pts" 
    },

    { 
      id: "202512009", 
      surname: "Devonshire", 
      name: "Liam Oleander", 
      email: "liam.dev@example.com", 
      course: "BSIT", 
      dateCreated: "2025/02/28", 
      points: "8 pts" 
    },

    { 
      id: "201708019", 
      surname: "Montenegro",
      name: "Jericho Jay", 
      email: "meyer@example.com", 
      course: "BSBA", 
      dateCreated: "2017/01/09", 
      points: "0 pts" 
    },

    { 
      id: "202510101", 
      surname: "Lennox", 
      name: "McKenzie Ralph", 
      email: "lennox@example.com", 
      course: "BSOA", 
      dateCreated: "2025/01/01", 
      points: "7 pts" 
    },

    { 
      id: "202009001",
       surname: "Runehart", 
       name: "Aaron Lysander Kyle",
        email: "aaron.r@example.com",
         course: "BSHM", 
         dateCreated: "2020/01/01", 
         points: "20.15 pts" 
        },

    { 
      id: "202109001", 
      surname: "Runehart", 
      name: "Aiden Laurenzo Kurt", 
      email: "aiden.r@example.com", 
      course: "BSHM", 
      dateCreated: "2021/01/01", 
      points: "20.20 pts" 
    },

  ]);

  // Modal state
  const [viewingStudent, setViewingStudent] = useState(null);
  const [confirmRemoveStudent, setConfirmRemoveStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [registering, setRegistering] = useState(false);

  // FILTER
  const filteredByCourse = filter === "All" || filter === "Course"
    ? students
    : students.filter((s) => s.course === filter);

  // SORT BY SURNAME (then name). stable copy
  const filteredStudents = [...filteredByCourse].sort((a, b) => {
    const surnameCompare = a.surname.localeCompare(b.surname, undefined, { sensitivity: "base" });
    if (surnameCompare !== 0) return sortOrder === "asc" ? surnameCompare : -surnameCompare;
    // if same surname, sort by name
    const nameCompare = a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    return sortOrder === "asc" ? nameCompare : -nameCompare;
  });

  // close ellipsis when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const el = menuRefs.current[openMenuIndex];
      if (el && !el.contains(e.target)) setOpenMenuIndex(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuIndex]);

  // close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isDropdownOpen]);

  const handleSortToggle = () => setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));

  const handleView = (student) => {
    setIsEditing(false);
    setViewingStudent(student);
    setOpenMenuIndex(null);
  };
  const handleRemove = (student) => {
    setConfirmRemoveStudent(student);
    setOpenMenuIndex(null);
  };
  const confirmRemove = () => {
    if (!confirmRemoveStudent) return;
    setStudents(prev => prev.filter(s => s.id !== confirmRemoveStudent.id));
    setConfirmRemoveStudent(null);
  };
  const cancelRemove = () => setConfirmRemoveStudent(null);

  const closeView = () => { setViewingStudent(null); setIsEditing(false); };
  const startEdit = () => setIsEditing(true);
  const saveEdit = (edited) => {
    setStudents(prev => prev.map(s => (s.id === edited.id ? edited : s)));
    setViewingStudent(edited);
    setIsEditing(false);
  };

  const openRegister = () => { setRegistering(true); setOpenMenuIndex(null); };
  const cancelRegister = () => setRegistering(false);
  const saveRegister = (newStudent) => {
    setStudents(prev => [newStudent, ...prev]);
    setRegistering(false);
  };

  const courseOptions = ["All", "BSIT", "BSOA", "BSBM", "BSHM", "BSJOURN", "BSPSYCH"];

  return (
    <div className="user-management-container">
      {/* Title */}
      <div className="user-management-header">
        <h2 className="user-title">Student Management</h2>
      </div>

      {/* Filters */}
      <div className="user-management-filters">
        <div className="filter-left">
          <button className="register-btn" onClick={openRegister} aria-label="Register student">
            <img src={regUserDark} alt="" className="reg-icon dark"></img>
            <img src={regUserLight} alt="" className="reg-icon light"></img>
            <span className="register-label">Register Student</span>
          </button>
        </div>

        <div className="filter-right">
          {/* Sort Group */}
          <button className="sort-group" 
                  onClick={handleSortToggle} 
                  aria-pressed={sortOrder === "desc"}>

            <span className="filter-label sort-text">
                  {sortOrder === "asc" ? "A–Z" : "Z–A"}</span>

            {/* ASC/DESC ICONS */}
            {sortOrder === "asc" ? (
              <img src={sortDownDark} alt="sort-asc" className="sort-icon light sort-down" />
            ) : (
              <img src={sortUpDark} alt="sort-desc" className="sort-icon light sort-up" />
            )}
            {/* ASC/DESC ICON HOVER */}
            {sortOrder === "asc" ? (
              <img src={sortDownLight} alt="" className="sort-icon dark sort-down" />
            ) : (
              <img src={sortUpLight} alt="" className="sort-icon dark sort-up" />
            )}
          </button>

          {/* DROPDOWN */}
          <div className={`filter-group ${isDropdownOpen ? 'active' : ''}`} ref={dropdownRef}>
            <div className="dropdown">
              <button
                className="dropdown-btn"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="dropdown-label">{filter}</span>
                <img
                  src={isDropdownOpen ? dropDark : dropLight}
                  alt="Dropdown icon"
                  className="drop-icon"
                />
              </button>

              <div className="dropdown-content" role="menu">
                {courseOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`dropdown-item ${filter === c ? "active" : ""}`}
                    onClick={() => { setFilter(c); setIsDropdownOpen(false); }}
                  >
                    {c.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STUDENT TABLE =====*/}
      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th style={{width: '12%'}}>Student ID</th>
              <th style={{width: '44%'}}>Student Name</th>
              <th style={{width: '14%'}}>Course</th>
              <th style={{width: '12%'}}>Date Created</th>
              <th style={{width: '10%'}}>Points</th>
              <th style={{width: '8%'}}></th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.surname}, {student.name}</td>
                <td>{student.course}</td>
                <td>{student.dateCreated}</td>
                <td>{student.points}</td>
                <td className="ellipsis-cell" ref={el => (menuRefs.current[index] = el)}>
                  <img
                    src={ellipsisIcon}
                    alt="menu"
                    className="ellipsis-icon"
                    onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                    aria-haspopup="true"
                    aria-expanded={openMenuIndex === index}
                  />
                  {openMenuIndex === index && (
                    <div className="ellipsis-menu" role="menu">
                      <button type="button" onClick={() => handleView(student)}>View Details</button>
                      <button type="button" className="remove-option" onClick={() => handleRemove(student)}>Remove</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={6} style={{textAlign:'center', padding:'20px 0'}}>No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View / Edit Modal */}
      {viewingStudent && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Student Details</h3>

            {!isEditing ? (
              <div className="modal-body modal-grid">
                <div>
                  <strong>ID:</strong>
                  <div className="modal-val">{viewingStudent.id}</div>
                </div>
                <div>
                  <strong>SURNAME:</strong>
                  <div className="modal-val">{viewingStudent.surname}</div>
                </div>
                <div>
                  <strong>NAME:</strong>
                  <div className="modal-val">{viewingStudent.name}</div>
                </div>
                <div>
                  <strong>EMAIL ADDRESS:</strong>
                  <div className="modal-val">{viewingStudent.email}</div>
                </div>
                <div>
                  <strong>COURSE:</strong>
                  <div className="modal-val">{viewingStudent.course}</div>
                </div>
                <div>
                  <strong>Date Created:</strong>
                  <div className="modal-val">{viewingStudent.dateCreated}</div>
                </div>
                <div>
                  <strong>Points:</strong>
                  <div className="modal-val">{viewingStudent.points}</div>
                </div>
              </div>
            ) : (
              <EditStudentForm student={viewingStudent} onSave={saveEdit} onCancel={() => setIsEditing(false)} />
            )}

            <div className="modal-actions">
              {!isEditing ? (
                <>
                  <button onClick={startEdit} className="btn">Edit</button>
                  <button onClick={closeView} className="btn btn-secondary">Close</button>
                </>
              ) : (
                <>
                  {/* When editing the modal only shows Save / Cancel (as requested) */}
                  {/* Save handled inside EditStudentForm */}
                  <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Remove Modal */}
      {confirmRemoveStudent && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Confirm Remove</h3>
            <div className="modal-body">
              <p>Are you sure you want to remove <strong>{confirmRemoveStudent.name}</strong>?</p>
            </div>
            <div className="modal-actions">
              <button onClick={confirmRemove} className="btn btn-danger">OK</button>
              <button onClick={cancelRemove} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Register Student Modal */}
      {registering && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Register Student</h3>
            <RegisterStudentForm onSave={saveRegister} onCancel={cancelRegister} />
          </div>
        </div>
      )}
    </div>
  );
}

// --- Inline form components ---
function EditStudentForm({ student, onSave, onCancel }) {
  const [form, setForm] = useState({ ...student });

  useEffect(() => setForm({ ...student }), [student]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>ID<input name="id" value={form.id} onChange={handleChange} readOnly /></label>
      <label>Surname<input name="surname" value={form.surname || ""} onChange={handleChange} /></label>
      <label>Name<input name="name" value={form.name || ""} onChange={handleChange} /></label>
      <label>Email Address<input name="email" value={form.email || ""} onChange={handleChange} /></label>
      <label>Course<input name="course" value={form.course || ""} onChange={handleChange} /></label>
      <label>Date Created<input name="dateCreated" value={form.dateCreated || ""} onChange={handleChange} /></label>
      <label>Points<input name="points" value={form.points || ""} onChange={handleChange} /></label>

      <div className="modal-actions">
        <button type="submit" className="btn">Save</button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

function RegisterStudentForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    id: Date.now().toString(),
    surname: "",
    name: "",
    email: "",
    course: "",
    dateCreated: new Date().toISOString().slice(0,10).replace(/-/g,'/'),
    points: "0 pts",
  });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.surname?.trim()) return alert('Surname and Name are required');
    onSave(form);
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>ID<input name="id" value={form.id} onChange={handleChange} readOnly /></label>
      <label>Surname<input name="surname" value={form.surname} onChange={handleChange} /></label>
      <label>Name<input name="name" value={form.name} onChange={handleChange} /></label>
      <label>Email Address<input name="email" value={form.email} onChange={handleChange} /></label>
      <label>Course<input name="course" value={form.course} onChange={handleChange} /></label>
      <label>Date Created<input name="dateCreated" value={form.dateCreated} onChange={handleChange} /></label>
      <label>Points<input name="points" value={form.points} onChange={handleChange} /></label>

      <div className="modal-actions">
        <button type="submit" className="btn">Register</button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

export default Admin_UserManagement;