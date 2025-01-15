// Import dependencies
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://root:ranirahayu1784@onlinebookstore.hxbvf.mongodb.net/?retryWrites=true&w=majority&appName=onlinebookstore';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Schema definitions
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    cover_image: { type: String },
});

const transactionSchema = new mongoose.Schema({
    transaction_date: { type: Date, default: Date.now },
    total: { type: Number, required: true },
    confirm: { type: String, enum: ['Yes', 'No'], required: true },
    address: { type: String },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    profile_image_url: { type: String },
    role: { type: String, enum: ['Admin', 'User'], default: 'User' },
});

// Models
const Book = mongoose.model('Book', bookSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Online Bookstore API!');
});

// CRUD for Books
app.post('/books', async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).send({ message: 'Buku berhasil ditambahkan!', book });
    } catch (err) {
        res.status(400).send({ message: 'Gagal menambahkan buku', error: err.message });
    }
});

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).send({ message: 'Data buku berhasil diambil', books });
    } catch (err) {
        res.status(500).send({ message: 'Gagal mengambil data buku', error: err.message });
    }
});

app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send({ message: 'Buku tidak ditemukan' });
        res.status(200).send({ message: 'Data buku berhasil diambil', book });
    } catch (err) {
        res.status(500).send({ message: 'Gagal mengambil data buku', error: err.message });
    }
});

app.put('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) return res.status(404).send({ message: 'Buku tidak ditemukan' });
        res.status(200).send({ message: 'Buku berhasil diupdate', book });
    } catch (err) {
        res.status(400).send({ message: 'Gagal mengupdate buku', error: err.message });
    }
});

app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).send({ message: 'Buku tidak ditemukan' });
        res.status(200).send({ message: 'Buku berhasil dihapus', book });
    } catch (err) {
        res.status(500).send({ message: 'Gagal menghapus buku', error: err.message });
    }
});

// CRUD for Transactions
app.post('/transactions', async (req, res) => {
    try {
        const transaction = new Transaction(req.body);
        await transaction.save();
        res.status(201).send({ message: 'Transaksi berhasil ditambahkan!', transaction });
    } catch (err) {
        res.status(400).send({ message: 'Gagal menambahkan transaksi', error: err.message });
    }
});

app.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).send({ message: 'Data transaksi berhasil diambil', transactions });
    } catch (err) {
        res.status(500).send({ message: 'Gagal mengambil data transaksi', error: err.message });
    }
});

app.get('/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).send({ message: 'Transaksi tidak ditemukan' });
        res.status(200).send({ message: 'Data transaksi berhasil diambil', transaction });
    } catch (err) {
        res.status(500).send({ message: 'Gagal mengambil data transaksi', error: err.message });
    }
});

app.put('/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!transaction) return res.status(404).send({ message: 'Transaksi tidak ditemukan' });
        res.status(200).send({ message: 'Transaksi berhasil diupdate', transaction });
    } catch (err) {
        res.status(400).send({ message: 'Gagal mengupdate transaksi', error: err.message });
    }
});

app.delete('/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) return res.status(404).send({ message: 'Transaksi tidak ditemukan' });
        res.status(200).send({ message: 'Transaksi berhasil dihapus', transaction });
    } catch (err) {
        res.status(500).send({ message: 'Gagal menghapus transaksi', error: err.message });
    }
});

// CRUD for Users
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send({ message: 'Pengguna berhasil ditambahkan!', user });
    } catch (err) {
        res.status(400).send({ message: 'Gagal menambahkan pengguna', error: err.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send({ message: 'Data pengguna berhasil diambil', users });
    } catch (err) {
        res.status(500).send({ message: 'Gagal mengambil data pengguna', error: err.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send({ message: 'Pengguna tidak ditemukan' });
        res.status(200).send({ message: 'Data pengguna berhasil diambil', user });
    } catch (err) {
        res.status(500).send({ message: 'Gagal mengambil data pengguna', error: err.message });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).send({ message: 'Pengguna tidak ditemukan' });
        res.status(200).send({ message: 'Pengguna berhasil diupdate', user });
    } catch (err) {
        res.status(400).send({ message: 'Gagal mengupdate pengguna', error: err.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send({ message: 'Pengguna tidak ditemukan' });
        res.status(200).send({ message: 'Pengguna berhasil dihapus', user });
    } catch (err) {
        res.status(500).send({ message: 'Gagal menghapus pengguna', error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});