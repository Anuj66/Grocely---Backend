const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

connectToMongo();
const app = express();

app.use(cors())

const port = 8080;

app.use(express.json())

app.use('/api/auth', require('./routes/Auth'))
app.use('/api/product', require('./routes/Product'))
app.use('/api/productType', require('./routes/ProductType'))
app.use('/api/buyer', require('./routes/Buyer'))

app.listen(port, () => {
    console.log(`Grocely app listening on port ${port}`)
})