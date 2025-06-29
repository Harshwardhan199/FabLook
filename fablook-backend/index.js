const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db.js');

const userRoutes = require('./routes/userRoutes');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req,res) => {
  res.send("Backend Is Live...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
