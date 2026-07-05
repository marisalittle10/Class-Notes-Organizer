import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClasses } from "../api.js";

function Classes() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    async function loadClasses() {
      const data = await getClasses();
      setClasses(data);
    }

    loadClasses();
  }, []);

  return (
    <section className="page">
      <h2>Classes</h2>
      <p>Click a class to see all notes saved for that subject.</p>

      <div className="classes-grid">
        {classes.map((item) => (
          <Link
            className="class-card clickable-card"
            key={item.id}
            to={`/classes/${encodeURIComponent(item.name)}`}
          >
            <h3>{item.name}</h3>
            <p>{item.noteCount} note(s)</p>
            <span className="view-link">View notes →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Classes;
