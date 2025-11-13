const express = require('express')
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const logger = require('./helpers/logger');
const isProduction = process.env.NODE_ENV === 'production';

const routes = require('./routes'); 

const app = express()
const port = process.env.PORT || 9000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger.httpLogger);

// Swagger + Redoc (hanya jika bukan production)
require('./middleware/swagger')(app, isProduction);

app.use(routes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server started on port ${port}`);
})