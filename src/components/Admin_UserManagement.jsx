import React, { useState, useEffect, useRef, useCallback } from "react";
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
import api from "../services/api";

function Admin_UserManagement() {

  const [filter, setFilter] = useState("Course");
  const [sortOrder, setSortOrder] = useState("asc"); // asc = A-Z ; desc = Z-A
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // start empty - load from NestJS backend
  const [students, setStudents] = useState([]);

  // load/save cache key so data remains visible after browser refresh
  const CACHE_KEY = 'cap_users_v1';

  // Helper: format points for display
  const fmtPoints = (p) => (p === null || p === undefined ? '0 pts' : (typeof p === 'number' ? `${p} pts` : `${p}`));

  // Helper: parse numeric points from form value like "10 pts" or numeric string
  const parsePoints = (p) => {
    if (p === null || p === undefined) return 0;
    if (typeof p === 'number') return p;
    const n = parseFloat(String(p).replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : 0;
  };

  // Define fetchUsers before the effect so dependency works
  const fetchUsers = useCallback(async () => {
    try {
      const data = await api.getUsers();
      const mapped = data.map(u => ({
        id: String(u.id),
        uid: u.uid || String(u.id),
        surname: u.surname,
        name: u.name,
        email: u.email,
        course: u.course ?? '',
        dateCreated: u.dateCreated || (u.date_registered || u.date_created || '').split('T')[0]?.replace(/-/g,'/'),
        points: fmtPoints(u.points)
      }));
      setStudents(mapped);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(mapped)); } catch (e) { /* ignore */ }
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  }, []);

  // Load users from cache first so UI persists between refreshes, then fetch authoritative list
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (Array.isArray(cached) && cached.length) setStudents(cached);
      }
    } catch (e) {
      // ignore malformed cache
    }
    fetchUsers();
  }, [fetchUsers]);

  const saveCache = (arr) => {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(arr)); } catch (e) { /* ignore */ }
  };

  // Modal state
  const [viewingStudent, setViewingStudent] = useState(null);
  const [confirmRemoveStudent, setConfirmRemoveStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [registering, setRegistering] = useState(false);
  // Alert modal state (for validation/errors)
  const [alertModal, setAlertModal] = useState(null);

  const showAlert = (msg) => setAlertModal(String(msg || ''));
  const closeAlert = () => setAlertModal(null);

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
    const id = confirmRemoveStudent.id;
    api.deleteUser(id)
      .then(() => {
        setStudents(prev => {
          const next = prev.filter(s => s.id !== id);
          saveCache(next);
          return next;
        });
        setConfirmRemoveStudent(null);
      })
      .catch(err => {
        console.error('Delete failed', err);
        showAlert('Failed to delete user. See console for details.');
      });
  };
  const cancelRemove = () => setConfirmRemoveStudent(null);

  const closeView = () => { setViewingStudent(null); setIsEditing(false); };
  const startEdit = () => setIsEditing(true);
  const saveEdit = (edited) => {
    // send update to NestJS backend
    const id = edited.id;
    const body = {
      surname: edited.surname,
      name: edited.name,
      email: edited.email,
      points: parsePoints(edited.points),
      course: edited.course
    };
    api.updateUser(id, body)
      .then(() => {
        // reflect in UI and cache
        setStudents(prev => {
          const next = prev.map(s => (s.id === edited.id ? { ...edited, points: fmtPoints(parsePoints(edited.points)) } : s));
          saveCache(next);
          return next;
        });
        setViewingStudent({ ...edited, points: fmtPoints(parsePoints(edited.points)) });
        setIsEditing(false);
      })
      .catch(err => {
        console.error('Update failed', err);
        showAlert('Failed to update user. See console for details.');
      });
  };

  const openRegister = () => { setRegistering(true); setOpenMenuIndex(null); };
  const cancelRegister = () => setRegistering(false);
  const saveRegister = (newStudent) => {
    // create on NestJS backend
    const body = {
      surname: newStudent.surname,
      name: newStudent.name,
      email: newStudent.email,
      password: newStudent.password ?? 'temp',
      points: parsePoints(newStudent.points),
      course: newStudent.course
    };
    api.createUser(body)
      .then(res => {
        if (!res || !res.id) throw new Error('Invalid response');
        const created = { ...newStudent, id: String(res.id), uid: res.uid || String(res.id), points: fmtPoints(parsePoints(newStudent.points)) };
        setStudents(prev => {
          const next = [created, ...prev];
          saveCache(next);
          return next;
        });
        setRegistering(false);
      })
      .catch(err => {
        console.error('Create user failed', err);
        showAlert('Failed to create user. See console for details.');
      });
  };

  const courseOptions = ["All", "BSIT", "BSCS", "BSOA", "BSBM", "BSBA", "BSJOURN", "BSPSYCH"];

  return (
    <div className="user-management-container">
      <h2 className="welcome-text">User Management</h2>
      {/* Title */}
      {/* <div className="user-management-header">
        <h3 className="card-title">Student Management</h3>
      </div> */}

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
              {/* Renamed column label from USER_UID to UID per request */}
              <th style={{width: '12%'}}>UID</th>
              <th style={{width: '40%'}}>Student Name</th>
              <th style={{width: '14%'}}>Course</th>
              <th style={{width: '12%'}}>Date Created</th>
              <th style={{width: '10%'}}>Points</th>
              <th style={{width: '8%'}}></th>
            </tr>
        </thead>

          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student.id}>
                <td>{student.uid || student.id}</td>
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
                  />
                  {openMenuIndex === index && (
                    <div className="ellipsis-menu" role="menu">
                      <button type="button" onClick={() => handleView(student)}>View Details</button>
                      <button type="button" onClick={() => handleRemove(student)}>Remove</button>
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
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-card">
            <h3>Student Details</h3>

            {!isEditing ? (
              <div className="modal-body modal-grid">
                <div>
                  {/* Display label changed from ID to UID */}
                  <strong>UID:</strong>
                  <div className="modal-val">{viewingStudent.id}</div>
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
                  <div className="modal-val">
                    <select
                      value={viewingStudent.course || ""}
                      onChange={(e) => {
                        const nextCourse = e.target.value;
                        const updated = { ...viewingStudent, course: nextCourse };
                        setViewingStudent(updated);
                        // also update students list immediately
                        setStudents(prev => {
                          const next = prev.map(s => s.id === updated.id ? { ...s, course: nextCourse } : s);
                          saveCache(next);
                          return next;
                        });
                        // persist change to backend
                        api.updateUser(updated.id, { course: nextCourse })
                          .catch(err => { console.error('Failed to update course', err); showAlert('Failed to update course.'); });
                      }}
                    >
                      <option value="">Select course</option>
                      <option value="BSIT">BSIT</option>
                      <option value="BSCS">BSCS</option>
                      <option value="BSOA">BSOA</option>
                      <option value="BSBM">BSBM</option>
                      <option value="BSBA">BSBA</option>
                      <option value="BSJOURN">BSJOURN</option>
                      <option value="BSPSYCH">BSPSYCH</option>
                    </select>
                  </div>
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
              <EditStudentForm student={viewingStudent} onSave={saveEdit} onCancel={() => setIsEditing(false)} showAlert={showAlert} />
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
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal (validation/errors) */}
      {alertModal && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <div className="modal-card">
            <h3>Attention</h3>
            <div className="modal-body">
              <p>{alertModal}</p>
            </div>
            <div className="modal-actions">
              <button onClick={closeAlert} className="btn">OK</button>
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
            <RegisterStudentForm onSave={saveRegister} onCancel={cancelRegister} showAlert={showAlert} />
          </div>
        </div>
      )}
    </div>
  );
}

// --- Inline form components ---
function EditStudentForm({ student, onSave, onCancel, showAlert }) {
  const [form, setForm] = useState({ ...student });

  useEffect(() => setForm({ ...student }), [student]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // validate required fields
    if (!form.name?.trim() || !form.surname?.trim()) {
      if (typeof showAlert === 'function') return showAlert('Surname and Name should be filled');
      return alert('Surname and Name should be filled');
    }
    onSave(form);
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
  {/* Input label changed from ID to UID */}
  <label>UID<input name="id" value={form.id} onChange={handleChange} readOnly /></label>
      <label>Surname<input name="surname" value={form.surname || ""} onChange={handleChange} /></label>
      <label>Name<input name="name" value={form.name || ""} onChange={handleChange} /></label>
      <label>Email Address<input name="email" value={form.email || ""} onChange={handleChange} /></label>
      <label>Course
        <select name="course" value={form.course || ""} onChange={handleChange}>
          <option value="">Select course</option>
          <option value="BSIT">BSIT</option>
          <option value="BSCS">BSCS</option>
          <option value="BSOA">BSOA</option>
          <option value="BSBM">BSBM</option>
          <option value="BSBA">BSBA</option>
          <option value="BSJOURN">BSJOURN</option>
          <option value="BSPSYCH">BSPSYCH</option>
        </select>
      </label>
      <label>Date Created<input name="dateCreated" value={form.dateCreated || ""} onChange={handleChange} /></label>
      <label>Points<input name="points" value={form.points || ""} onChange={handleChange} /></label>

      <div className="modal-actions">
        <button type="submit" className="btn">Save</button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

function RegisterStudentForm({ onSave, onCancel, showAlert }) {
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
    if (!form.name.trim() || !form.surname?.trim()) {
      if (typeof showAlert === 'function') return showAlert('Surname and Name should be filled');
      return alert('Surname and Name should be filled');
    }
    onSave(form);
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
  {/* Input label changed from ID to UID */}
  <label>UID<input name="id" value={form.id} onChange={handleChange} readOnly /></label>
      <label>Surname<input name="surname" value={form.surname} onChange={handleChange} /></label>
      <label>Name<input name="name" value={form.name} onChange={handleChange} /></label>
      <label>Email Address<input name="email" value={form.email} onChange={handleChange} /></label>
      <label>Course
        <select name="course" value={form.course} onChange={handleChange}>
          <option value="">Select course</option>
          <option value="BSIT">BSIT</option>
          <option value="BSCS">BSCS</option>
          <option value="BSOA">BSOA</option>
          <option value="BSBM">BSBM</option>
          <option value="BSBA">BSBA</option>
          <option value="BSJOURN">BSJOURN</option>
          <option value="BSPSYCH">BSPSYCH</option>
        </select>
      </label>
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