// Import dependencies
require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON body data

// MongoDB connection
const mongoURI = process.env.MONGO_URI; // Load MongoDB URI from environment variables
if (!mongoURI) {
    console.error('Error: MONGO_URI is not set in the environment variables');
    process.exit(1); // Exit if MongoDB URI is not set
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit if connection fails
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
        res.status(201).send({ message: 'Book added successfully!', book });
    } catch (err) {
        res.status(400).send({ message: 'Failed to add book', error: err.message });
    }
});

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).send({ message: 'Books retrieved successfully', books });
    } catch (err) {
        res.status(500).send({ message: 'Failed to retrieve books', error: err.message });
    }
});

app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send({ message: 'Book not found' });
        res.status(200).send({ message: 'Book retrieved successfully', book });
    } catch (err) {
        res.status(500).send({ message: 'Failed to retrieve book', error: err.message });
    }
});

app.put('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) return res.status(404).send({ message: 'Book not found' });
        res.status(200).send({ message: 'Book updated successfully', book });
    } catch (err) {
        res.status(400).send({ message: 'Failed to update book', error: err.message });
    }
});

app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).send({ message: 'Book not found' });
        res.status(200).send({ message: 'Book deleted successfully', book });
    } catch (err) {
        res.status(500).send({ message: 'Failed to delete book', error: err.message });
    }
});

// CRUD for Transactions
app.post('/transactions', async (req, res) => {
    try {
        const transaction = new Transaction(req.body);
        await transaction.save();
        res.status(201).send({ message: 'Transaction added successfully!', transaction });
    } catch (err) {
        res.status(400).send({ message: 'Failed to add transaction', error: err.message });
    }
});

app.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).send({ message: 'Transactions retrieved successfully', transactions });
    } catch (err) {
        res.status(500).send({ message: 'Failed to retrieve transactions', error: err.message });
    }
});

app.get('/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).send({ message: 'Transaction not found' });
        res.status(200).send({ message: 'Transaction retrieved successfully', transaction });
    } catch (err) {
        res.status(500).send({ message: 'Failed to retrieve transaction', error: err.message });
    }
});

app.put('/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!transaction) return res.status(404).send({ message: 'Transaction not found' });
        res.status(200).send({ message: 'Transaction updated successfully', transaction });
    } catch (err) {
        res.status(400).send({ message: 'Failed to update transaction', error: err.message });
    }
});

app.delete('/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) return res.status(404).send({ message: 'Transaction not found' });
        res.status(200).send({ message: 'Transaction deleted successfully', transaction });
    } catch (err) {
        res.status(500).send({ message: 'Failed to delete transaction', error: err.message });
    }
});

// CRUD for Users
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send({ message: 'User added successfully!', user });
    } catch (err) {
        res.status(400).send({ message: 'Failed to add user', error: err.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send({ message: 'Users retrieved successfully', users });
    } catch (err) {
        res.status(500).send({ message: 'Failed to retrieve users', error: err.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send({ message: 'User not found' });
        res.status(200).send({ message: 'User retrieved successfully', user });
    } catch (err) {
        res.status(500).send({ message: 'Failed to retrieve user', error: err.message });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).send({ message: 'User not found' });
        res.status(200).send({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(400).send({ message: 'Failed to update user', error: err.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send({ message: 'User not found' });
        res.status(200).send({ message: 'User deleted successfully', user });
    } catch (err) {
        res.status(500).send({ message: 'Failed to delete user', error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
