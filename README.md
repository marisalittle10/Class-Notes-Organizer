# Class Notes Organizer

## Overview

Class Notes Organizer is a full-stack web app made for students to organize class notes and study materials. Users can add, view, edit, and delete notes. The app also includes file uploads and a basic scratchpad.

## Features

* Dashboard with note, class, and file totals
* Add, view, edit, and delete notes
* Organize notes by class
* Upload and delete files
* Basic scratchpad
* SQLite database for saving data

## Technologies Used

* React
* Vite
* CSS
* Node.js
* Express
* SQLite

## Database

The project uses SQLite. The main tables are `notes` and `files`. The notes table stores the note title, content, class name, tags, created date, and updated date. Each note has an `id` as the primary key.

## How to Run

### Backend

```bash
cd server
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```


