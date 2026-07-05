import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Notes from "./pages/Notes.jsx";
import AddNote from "./pages/AddNote.jsx";
import EditNote from "./pages/EditNote.jsx";
import Classes from "./pages/Classes.jsx";
import ClassNotes from "./pages/ClassNotes.jsx";
import Files from "./pages/Files.jsx";
import Scratchpad from "./pages/Scratchpad.jsx";

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <header className="top-header">
          <div>
            <h1>Class Notes Organizer</h1>
            <p>Keep all your study materials in one place</p>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/add-note" element={<AddNote />} />
          <Route path="/edit-note/:id" element={<EditNote />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/:className" element={<ClassNotes />} />
          <Route path="/files" element={<Files />} />
          <Route path="/scratchpad" element={<Scratchpad />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
