const API_URL = "http://localhost:3000";

export async function getNotes() {
  const response = await fetch(`${API_URL}/notes`);
  return response.json();
}

export async function getNote(id) {
  const response = await fetch(`${API_URL}/notes/${id}`);
  return response.json();
}

export async function getNotesByClass(className) {
  const response = await fetch(`${API_URL}/classes/${encodeURIComponent(className)}/notes`);
  return response.json();
}

export async function createNote(note) {
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(note)
  });

  return response.json();
}

export async function updateNote(id, note) {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(note)
  });

  return response.json();
}

export async function deleteNote(id) {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE"
  });

  return response.json();
}

export async function getClasses() {
  const response = await fetch(`${API_URL}/classes`);
  return response.json();
}

export async function getFiles() {
  const response = await fetch(`${API_URL}/files`);
  return response.json();
}

export async function uploadFile(fileData) {
  const response = await fetch(`${API_URL}/files`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(fileData)
  });

  return response.json();
}

export async function createFile(fileData) {
  return uploadFile(fileData);
}

export async function deleteFile(id) {
  const response = await fetch(`${API_URL}/files/${id}`, {
    method: "DELETE"
  });

  return response.json();
}
