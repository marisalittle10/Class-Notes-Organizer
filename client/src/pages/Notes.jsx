import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteNote, getNotes } from "../api.js";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");

  async function loadNotes() {
    const data = await getNotes();
    setNotes(data);
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function handleDelete(id) {
    await deleteNote(id);
    loadNotes();
  }

  const classOptions = ["All", ...new Set(notes.map((note) => note.className))];

  const filteredNotes = notes.filter((note) => {
    const searchText = `${note.title} ${note.content} ${note.className}`.toLowerCase();
    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "All" || note.className === selectedClass;

    return matchesSearch && matchesClass;
  });

  return (
    <section className="page">
      <div className="page-title-row">
        <div>
          <h2>Notes</h2>
          <p>View, search, edit, and delete your class notes.</p>
        </div>
        <Link className="primary-button" to="/add-note">Add Note</Link>
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          value={selectedClass}
          onChange={(event) => setSelectedClass(event.target.value)}
        >
          {classOptions.map((className) => (
            <option key={className} value={className}>{className}</option>
          ))}
        </select>
      </div>

      <p className="count-text">Showing {filteredNotes.length} of {notes.length} notes</p>

      <div className="notes-grid">
        {filteredNotes.map((note) => (
          <article className="note-card" key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className="tag-row">
              <span>{note.className}</span>
              {note.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
            <div className="button-row">
              <Link className="secondary-button" to={`/edit-note/${note.id}`}>Edit</Link>
              <button className="danger-button" onClick={() => handleDelete(note.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Notes;
