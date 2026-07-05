import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard.jsx";
import { getClasses, getFiles, getNotes } from "../api.js";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const notesData = await getNotes();
        const classesData = await getClasses();
        const filesData = await getFiles();

        setNotes(notesData);
        setClasses(classesData);
        setFiles(filesData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <section className="page">
      <div className="page-title-row">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back! Here is an overview of your study materials.</p>
        </div>
        <Link className="primary-button" to="/add-note">Add New Note</Link>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Notes" value={notes.length} />
        <StatCard label="Classes" value={classes.length} />
        <StatCard label="Files" value={files.length} />
      </div>

      <div className="card">
        <div className="card-title-row">
          <h3>Recent Notes</h3>
          <Link to="/notes">View all</Link>
        </div>

        {notes.slice(0, 3).map((note) => (
          <div className="note-preview" key={note.id}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <span>{note.className}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
