const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '', // your MySQL password if any
	database: 'inventory_db',
});

db.connect((err) => {
	if (err) return console.log('DB ERROR:', err);
	console.log('Connected to MySQL');
});

// Routes
app.get('/items', (req, res) => {
	db.query('SELECT * FROM items', (err, result) => {
		if (err) return res.status(500).json(err);
		res.json(result);
	});
});

app.post('/items', (req, res) => {
	const { name, quantity, price } = req.body;
	db.query(
		'INSERT INTO items (name, quantity, price) VALUES (?, ?, ?)',
		[name, quantity, price],
		(err, result) => {
			if (err) return res.status(500).json(err);
			res.json({ id: result.insertId, name, quantity, price });
		},
	);
});

app.put('/items/:id', (req, res) => {
	const { id } = req.params;
	const { name, quantity, price } = req.body;

	db.query(
		'UPDATE items SET name=?, quantity=?, price=? WHERE id=?',
		[name, quantity, price, id],
		(err) => {
			if (err) return res.status(500).json(err);
			res.json({ message: 'Item updated' });
		},
	);
});

app.delete('/items/:id', (req, res) => {
	const { id } = req.params;

	db.query('DELETE FROM items WHERE id=?', [id], (err) => {
		if (err) return res.status(500).json(err);
		res.json({ message: 'Item deleted' });
	});
});

app.listen(3001, () => console.log('Backend running on 3001'));
