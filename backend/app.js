const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://normal-app2-1.onrender.com'],
  credentials: true
}));

app.use(express.json());

// ... existing code ...

