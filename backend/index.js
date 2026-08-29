
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require('./app')

dotenv.config();



mongoose.connect(process.env.MONGOURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Database connection error:", err));


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
