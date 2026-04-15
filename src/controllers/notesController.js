const Note = require('../models/Note');

// GET all notes
exports.getAllNotes = (req, res) => {
  let notes = Note.getAll();

  // ✅ TC4: sort latest first
  notes.sort((a, b) => b.id - a.id);

  res.status(200).json({
    success: true,
    data: notes,
    count: notes.length
  });
};


// GET note by ID
exports.getNoteById = (req, res) => {
  const id = req.params.id;

  // ✅ TC8: invalid ID format
  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID' });
  }

  const note = Note.getById(Number(id));

  if (!note) {
    return res.status(404).json({ success: false, message: 'Note not found' });
  }

  res.status(200).json({
    success: true,
    data: note
  });
};


// CREATE note
exports.createNote = (req, res) => {
  let { title, content } = req.body;

  // ✅ TC13: trim input
  title = title?.trim();
  content = content?.trim();

  // validation
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content required' });
  }

  // ✅ TC16: prevent duplicate
  const existing = Note.getAll().find(
    n => n.title === title && n.content === content
  );

  if (existing) {
    return res.status(409).json({ success: false, message: 'Duplicate note' });
  }

  const note = Note.create(title, content);

  res.status(201).json({
    success: true,
    data: note
  });
};


// UPDATE note
exports.updateNote = (req, res) => {
  const id = req.params.id;

  // ✅ TC21: invalid ID
  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID' });
  }

  const note = Note.getById(Number(id));

  if (!note) {
    return res.status(404).json({ success: false, message: 'Note not found' });
  }

  const { title, content } = req.body;

  // ✅ TC20: empty body
  if (!title && !content) {
    return res.status(400).json({ success: false, message: 'Nothing to update' });
  }

  // ✅ TC19: partial update
  if (title) note.title = title.trim();
  if (content) note.content = content.trim();

  res.status(200).json({
    success: true,
    data: note
  });
};


// DELETE note
exports.deleteNote = (req, res) => {
  const id = req.params.id;

  // ✅ TC25: invalid ID
  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID' });
  }

  const deleted = Note.delete(Number(id));

  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Note not found' });
  }

  res.status(200).json({
    success: true
  });
};