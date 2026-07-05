import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNote } from "../api.js";

function AddNote() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    className: "",
    content: "",
    tags: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newNote = {
      title: formData.title,
      className: formData.className,
      content: formData.content,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")
    };

    await createNote(newNote);
    navigate("/notes");
  }

  return (
    <section className="page">
      <h2>Add Note</h2>
      <p>Create a new note for one of your classes.</p>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Note Title
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: Biology Chapter 3"
            required
          />
        </label>

        <label>
          Class Name
          <input
            name="className"
            type="text"
            value={formData.className}
            onChange={handleChange}
            placeholder="Example: Biology"
            required
          />
        </label>

        <label>
          Content
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your notes here..."
            required
          />
        </label>

        <label>
          Tags
          <input
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Example: chapter3, cells, test review"
          />
        </label>

        <button className="primary-button" type="submit">Save Note</button>
      </form>
    </section>
  );
}

export default AddNote;
