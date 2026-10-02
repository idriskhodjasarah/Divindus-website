require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const quoteRoutes = require('./routes/quotes');
const messageRoutes = require('./routes/messages');
const contentRoutes = require('./routes/content');
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/content', contentRoutes);
app.use('/quotes', quoteRoutes);
app.use('/messages', messageRoutes);
app.get('/', (req, res) => {
  res.send('DIVINDUS API is running');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));