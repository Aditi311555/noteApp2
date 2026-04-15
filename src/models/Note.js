let notes = [];
let nextId = 1;

const getAll = () => notes;

const getById = (id) => notes.find(n => n.id === Number(id));

const create = (title, content) => {
  const note = {
    id: nextId++,
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  notes.push(note);
  return note;
};

const update = (id, title, content) => {
  const idx = notes.findIndex(n => n.id === Number(id));
  if (idx === -1) return null;

  // ✅ partial update (TC19 fix)
  if (title !== undefined) notes[idx].title = title;
  if (content !== undefined) notes[idx].content = content;

  notes[idx].updatedAt = new Date().toISOString();

  return notes[idx];
};

const deleteNote = (id) => {
  const idx = notes.findIndex(n => n.id === Number(id));
  if (idx === -1) return false;

  notes.splice(idx, 1);
  return true;
};

const reset = () => {
  notes = [];
  nextId = 1;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteNote, // ✅ match controller
  reset
};