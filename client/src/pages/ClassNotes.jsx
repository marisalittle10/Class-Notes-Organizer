import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteNote, getNotesByClass } from "../api.js";

function ClassNotes() {
  const { className } = useParams();
  const decodedClassName = decodeURIComponent(className);
  const [notes, setNotes] = useState([]);

  async function loadNotes() {
    const data = await getNotesByClass(decodedClassName);
    setNotes(data);
  }

  useEffect(() => {
    loadNotes();
  }, [decodedClassName]);

  async function handleDelete(id) {
    await deleteNote(id);
    loadNotes();
  }

  return (
    <section className="page">
      <div className="page-title-row">
        <div>
          <h2>{decodedClassName}</h2>
          <p>All notes saved for this class.</p>
        </div>
        <Link className="secondary-button" to="/classes">Back to Classes</Link>
      </div>

      <p className="count-text">Showing {notes.length} note(s)</p>

      <div className="notes-grid">
        {notes.map((note) => (
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

export default ClassNotes;
