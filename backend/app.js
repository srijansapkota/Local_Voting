const express = require('express');
const cors = require('cors');

const app = express();

app.use(
  cors({
    origin: import.meta.env.mode === "development"
      ? 'http://localhost:5173'
      : '/', 
    credentials: true,
  })
);


app.use(express.json());

// ... existing code ...

