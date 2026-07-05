import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Notes App</h2>
      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/notes">Notes</NavLink>
        <NavLink to="/add-note">Add Note</NavLink>
        <NavLink to="/classes">Classes</NavLink>
        <NavLink to="/files">Files</NavLink>
        <NavLink to="/scratchpad">Scratchpad</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
