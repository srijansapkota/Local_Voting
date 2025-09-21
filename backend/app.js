const express = require('express');
const cors = require('cors');

const app = express();

app.use(
  cors({
    origin: process.env.NODE_ENV === "development"
      ? 'http://localhost:5173'
      : process.env.FRONTEND_URL || '*', 
    credentials: true,
  })
);


app.use(express.json());

// ... existing code ...

