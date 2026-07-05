import React, { useEffect, useState } from "react";
import { deleteFile, getFiles, uploadFile } from "../api.js";

function Files() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [className, setClassName] = useState("");
  const [message, setMessage] = useState("");

  async function loadFiles() {
    const data = await getFiles();
    setFiles(data);
  }

  useEffect(() => {
    loadFiles();
  }, []);

  function convertFileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0]);
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
      setMessage("Please choose a file first.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage("Please choose a file smaller than 5 MB.");
      return;
    }

    const dataUrl = await convertFileToDataUrl(selectedFile);

    await uploadFile({
      fileName: selectedFile.name,
      fileType: selectedFile.type || "Unknown",
      className: className || "General",
      size: selectedFile.size,
      dataUrl
    });

    setSelectedFile(null);
    setClassName("");
    setMessage("File uploaded successfully.");
    event.target.reset();
    loadFiles();
  }

  async function handleDelete(id) {
    await deleteFile(id);
    loadFiles();
  }

  function formatFileSize(size) {
    if (!size) {
      return "Unknown size";
    }

    if (size < 1024) {
      return `${size} bytes`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <section className="page">
      <h2>Files</h2>
      <p>Upload study materials like images, PDFs, and documents up to 5 MB.</p>

      <form className="form-card small-form" onSubmit={handleSubmit}>
        <label>
          Choose File
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt,.ppt,.pptx"
            onChange={handleFileChange}
            required
          />
        </label>

        <label>
          Class Name
          <input
            type="text"
            value={className}
            onChange={(event) => setClassName(event.target.value)}
            placeholder="Example: Biology"
          />
        </label>

        <button className="primary-button" type="submit">Upload File</button>
        {message && <p className="status-message">{message}</p>}
      </form>

      <div className="notes-grid">
        {files.map((file) => (
          <article className="note-card" key={file.id}>
            {file.dataUrl && file.fileType.startsWith("image/") && (
              <img className="file-preview" src={file.dataUrl} alt={file.fileName} />
            )}
            <h3>{file.fileName}</h3>
            <p>Type: {file.fileType}</p>
            <p>Class: {file.className}</p>
            <p>Size: {formatFileSize(file.size)}</p>
            <p>Uploaded: {file.uploadDate}</p>
            <div className="button-row">
              {file.dataUrl && (
                <a className="secondary-button" href={file.dataUrl} download={file.fileName}>
                  Download/Open
                </a>
              )}
              <button className="danger-button" onClick={() => handleDelete(file.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Files;
