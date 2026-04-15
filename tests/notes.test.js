const request = require('supertest');
const app = require('../src/app');
const Note = require('../src/models/Note');

beforeEach(() => Note.reset());

/* ===================== GET /api/notes ===================== */
describe('GET /api/notes', () => {

  // TC1
  it('TC1: should return empty array initially', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
    expect(res.body.count).toBe(0);
  });

  // TC2
  it('TC2: should return all notes', async () => {
    Note.create('Test Title', 'Test Content');
    const res = await request(app).get('/api/notes');
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].title).toBe('Test Title');
  });

  // TC3
  it('TC3: should handle multiple notes correctly', async () => {
    Note.create('Note 1', 'Content 1');
    Note.create('Note 2', 'Content 2');

    const res = await request(app).get('/api/notes');
    expect(res.body.count).toBe(2);
    expect(res.body.data.length).toBe(2);
  });

  // TC4
  it('TC4: should return notes in consistent order (latest first)', async () => {
    Note.create('First', 'A');
    Note.create('Second', 'B');

    const res = await request(app).get('/api/notes');
    expect(res.body.data[0].title).toBe('Second'); // if sorting exists
  });

  // TC5
  it('TC5: should return consistent response structure', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');
  });

});


/* ===================== GET /api/notes/:id ===================== */
describe('GET /api/notes/:id', () => {

  // TC6
  it('TC6: should return a note by id', async () => {
    const note = Note.create('Hello', 'World');
    const res = await request(app).get(`/api/notes/${note.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Hello');
  });

  // TC7
  it('TC7: should return 404 for missing note', async () => {
    const res = await request(app).get('/api/notes/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  // TC8
  it('TC8: should handle invalid id format', async () => {
    const res = await request(app).get('/api/notes/abc');
    expect(res.statusCode).toBe(400);
  });

  // TC9
  it('TC9: should not expose internal fields', async () => {
    const note = Note.create('Secure', 'Hidden');
    const res = await request(app).get(`/api/notes/${note.id}`);
    expect(res.body.data).not.toHaveProperty('__v');
  });

});


/* ===================== POST /api/notes ===================== */
describe('POST /api/notes', () => {

  // TC10
  it('TC10: should create a new note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({ title: 'New Note', content: 'Some content' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe('New Note');
    expect(res.body.data.id).toBeDefined();
  });

  // TC11
  it('TC11: should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({ content: 'No title here' });

    expect(res.statusCode).toBe(400);
  });

  // TC12
  it('TC12: should return 400 if content is missing', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({ title: 'No content' });

    expect(res.statusCode).toBe(400);
  });

  // TC13
  it('TC13: should trim whitespace from title and content', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({ title: '   Title   ', content: '   Content   ' });

    expect(res.body.data.title).toBe('Title');
  });

  // TC14
  it('TC14: should not allow empty strings', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({ title: '', content: '' });

    expect(res.statusCode).toBe(400);
  });

  // TC15
  it('TC15: should handle very long input', async () => {
    const longText = 'a'.repeat(1000);

    const res = await request(app)
      .post('/api/notes')
      .send({ title: longText, content: longText });

    expect(res.statusCode).toBe(201);
  });

  // TC16
  it('TC16: should prevent duplicate notes (if implemented)', async () => {
    await request(app).post('/api/notes').send({ title: 'Same', content: 'Same' });

    const res = await request(app)
      .post('/api/notes')
      .send({ title: 'Same', content: 'Same' });

    expect([400, 409]).toContain(res.statusCode);
  });

});


/* ===================== PUT /api/notes/:id ===================== */
describe('PUT /api/notes/:id', () => {

  // TC17
  it('TC17: should update an existing note', async () => {
    const note = Note.create('Old Title', 'Old Content');

    const res = await request(app)
      .put(`/api/notes/${note.id}`)
      .send({ title: 'Updated Title', content: 'Updated Content' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Updated Title');
  });

  // TC18
  it('TC18: should return 404 for non-existent note', async () => {
    const res = await request(app)
      .put('/api/notes/999')
      .send({ title: 'X', content: 'Y' });

    expect(res.statusCode).toBe(404);
  });

  // TC19
  it('TC19: should partially update note (only title)', async () => {
    const note = Note.create('Old', 'Content');

    const res = await request(app)
      .put(`/api/notes/${note.id}`)
      .send({ title: 'New Title' });

    expect(res.body.data.title).toBe('New Title');
    expect(res.body.data.content).toBe('Content');
  });

  // TC20
  it('TC20: should reject empty update body', async () => {
    const note = Note.create('Test', 'Test');

    const res = await request(app)
      .put(`/api/notes/${note.id}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });

  // TC21
  it('TC21: should handle invalid id format', async () => {
    const res = await request(app)
      .put('/api/notes/abc')
      .send({ title: 'X' });

    expect(res.statusCode).toBe(400);
  });

});


/* ===================== DELETE /api/notes/:id ===================== */
describe('DELETE /api/notes/:id', () => {

  // TC22
  it('TC22: should delete a note', async () => {
    const note = Note.create('To Delete', 'Content');

    const res = await request(app).delete(`/api/notes/${note.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // TC23
  it('TC23: should return 404 for non-existent note', async () => {
    const res = await request(app).delete('/api/notes/999');
    expect(res.statusCode).toBe(404);
  });

  // TC24
  it('TC24: should actually remove note from store', async () => {
    const note = Note.create('Temp', 'Delete me');

    await request(app).delete(`/api/notes/${note.id}`);
    const res = await request(app).get(`/api/notes/${note.id}`);

    expect(res.statusCode).toBe(404);
  });

  // TC25
  it('TC25: should handle invalid id format', async () => {
    const res = await request(app).delete('/api/notes/abc');
    expect(res.statusCode).toBe(400);
  });

});


/* ===================== ADVANCED ===================== */
describe('Advanced scenarios', () => {

  // TC26
  it('TC26: should handle concurrent note creation', async () => {
    await Promise.all([
      request(app).post('/api/notes').send({ title: 'A', content: '1' }),
      request(app).post('/api/notes').send({ title: 'B', content: '2' }),
    ]);

    const res = await request(app).get('/api/notes');
    expect(res.body.count).toBe(2);
  });

});