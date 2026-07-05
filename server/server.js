const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const dataFolder = path.join(__dirname, "data");

if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder);
}

const db = new DatabaseSync(path.join(dataFolder, "class-notes.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    className TEXT NOT NULL,
    tags TEXT DEFAULT '[]',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fileName TEXT NOT NULL,
    fileType TEXT NOT NULL,
    className TEXT DEFAULT 'General',
    size INTEGER DEFAULT 0,
    dataUrl TEXT DEFAULT '',
    uploadDate TEXT NOT NULL
  );
`);

function getToday() {
  return new Date().toISOString();
}

function parseTags(tags) {
  try {
    const parsedTags = JSON.parse(tags || "[]");
    return Array.isArray(parsedTags) ? parsedTags : [];
  } catch (error) {
    return [];
  }
}

function formatNote(note) {
  return {
    ...note,
    tags: parseTags(note.tags)
  };
}

function addStarterNotes() {
  const count = db.prepare("SELECT COUNT(*) AS count FROM notes").get().count;

  if (count > 0) {
    return;
  }

  const addNote = db.prepare(`
    INSERT INTO notes (title, content, className, tags, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  addNote.run(
    "Calculus Basics",
    "Derivatives and integrals are fundamental concepts in calculus.",
    "Mathematics",
    JSON.stringify(["calculus", "review"]),
    "2026-06-01",
    "2026-06-01"
  );

  addNote.run(
    "World War II",
    "World War II lasted from 1939 to 1945 and involved many countries.",
    "History",
    JSON.stringify(["wwii", "history"]),
    "2026-06-03",
    "2026-06-03"
  );

  addNote.run(
    "React Components",
    "Components allow parts of the user interface to be reused in a React app.",
    "Web Development",
    JSON.stringify(["react", "components"]),
    "2026-06-07",
    "2026-06-07"
  );
}

function addStarterFiles() {
  const count = db.prepare("SELECT COUNT(*) AS count FROM files").get().count;

  if (count > 0) {
    return;
  }

  db.prepare(`
    INSERT INTO files (fileName, fileType, className, size, dataUrl, uploadDate)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run("biology-review.pdf", "PDF", "Biology", 0, "", "2026-06-08");
}

addStarterNotes();
addStarterFiles();

app.get("/", (req, res) => {
  res.send("Class Notes Organizer API is running with SQLite.");
});

app.get("/status", (req, res) => {
  const noteCount = db.prepare("SELECT COUNT(*) AS count FROM notes").get().count;
  const fileCount = db.prepare("SELECT COUNT(*) AS count FROM files").get().count;

  res.json({
    status: "ok",
    message: "Server is running",
    database: "SQLite",
    noteCount,
    fileCount
  });
});

app.get("/database-info", (req, res) => {
  const noteColumns = db.prepare("PRAGMA table_info(notes)").all();
  const fileColumns = db.prepare("PRAGMA table_info(files)").all();

  res.json({
    database: "SQLite",
    tables: ["notes", "files"],
    noteColumns,
    fileColumns
  });
});

app.get("/notes", (req, res) => {
  const notes = db
    .prepare("SELECT * FROM notes ORDER BY datetime(updatedAt) DESC, id DESC")
    .all()
    .map(formatNote);

  res.json(notes);
});

app.get("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = db.prepare("SELECT * FROM notes WHERE id = ?").get(id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json(formatNote(note));
});

app.post("/notes", (req, res) => {
  const { title, content, className, tags } = req.body;

  if (!title || !content || !className) {
    return res.status(400).json({
      message: "Title, content, and class name are required."
    });
  }

  const now = getToday();

  const result = db.prepare(`
    INSERT INTO notes (title, content, className, tags, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    title,
    content,
    className,
    JSON.stringify(Array.isArray(tags) ? tags : []),
    now,
    now
  );

  const newNote = db
    .prepare("SELECT * FROM notes WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(formatNote(newNote));
});

app.put("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = db.prepare("SELECT * FROM notes WHERE id = ?").get(id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  const { title, content, className, tags } = req.body;

  db.prepare(`
    UPDATE notes
    SET title = ?, content = ?, className = ?, tags = ?, updatedAt = ?
    WHERE id = ?
  `).run(
    title || note.title,
    content || note.content,
    className || note.className,
    JSON.stringify(Array.isArray(tags) ? tags : parseTags(note.tags)),
    getToday(),
    id
  );

  const updatedNote = db.prepare("SELECT * FROM notes WHERE id = ?").get(id);
  res.json(formatNote(updatedNote));
});

app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const result = db.prepare("DELETE FROM notes WHERE id = ?").run(id);

  if (result.changes === 0) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json({ message: "Note deleted successfully" });
});

app.get("/classes", (req, res) => {
  const classes = db.prepare(`
    SELECT className AS name, COUNT(*) AS noteCount
    FROM notes
    GROUP BY className
    ORDER BY className
  `).all();

  res.json(
    classes.map((item, index) => ({
      id: index + 1,
      name: item.name,
      noteCount: item.noteCount
    }))
  );
});

app.get("/classes/:className/notes", (req, res) => {
  const className = req.params.className;

  const notes = db.prepare(`
    SELECT * FROM notes
    WHERE lower(className) = lower(?)
    ORDER BY datetime(updatedAt) DESC, id DESC
  `).all(className).map(formatNote);

  res.json(notes);
});

app.get("/files", (req, res) => {
  const files = db
    .prepare("SELECT * FROM files ORDER BY datetime(uploadDate) DESC, id DESC")
    .all();

  res.json(files);
});

app.post("/files", (req, res) => {
  const { fileName, fileType, className, size, dataUrl } = req.body;

  if (!fileName || !fileType) {
    return res.status(400).json({ message: "File name and file type are required." });
  }

  const result = db.prepare(`
    INSERT INTO files (fileName, fileType, className, size, dataUrl, uploadDate)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    fileName,
    fileType,
    className || "General",
    size || 0,
    dataUrl || "",
    getToday()
  );

  const newFile = db
    .prepare("SELECT * FROM files WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(newFile);
});

app.delete("/files/:id", (req, res) => {
  const id = Number(req.params.id);
  const result = db.prepare("DELETE FROM files WHERE id = ?").run(id);

  if (result.changes === 0) {
    return res.status(404).json({ message: "File not found" });
  }

  res.json({ message: "File deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Class Notes Organizer API running on http://localhost:${PORT}`);
  console.log("SQLite database is saved in server/data/class-notes.db");
});
