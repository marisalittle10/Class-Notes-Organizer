import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getNote, updateNote } from "../api.js";

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    className: "",
    content: "",
    tags: ""
  });

  useEffect(() => {
    async function loadNote() {
      const note = await getNote(id);
      setFormData({
        title: note.title || "",
        className: note.className || "",
        content: note.content || "",
        tags: note.tags ? note.tags.join(", ") : ""
      });
    }

    loadNote();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const editedNote = {
      title: formData.title,
      className: formData.className,
      content: formData.content,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")
    };

    await updateNote(id, editedNote);
    navigate("/notes");
  }

  return (
    <section className="page">
      <h2>Edit Note</h2>
      <p>Update the title, class, content, or tags for this note.</p>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Note Title
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
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
            required
          />
        </label>

        <label>
          Content
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
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
          />
        </label>

        <button className="primary-button" type="submit">Update Note</button>
      </form>
    </section>
  );
}

export default EditNote;
