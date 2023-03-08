// const express = require('express');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
// middleware
app.use(cors());
app.use(express.json());
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const errorMiddleware = require('./middleware/error');

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
// Route Imports
const generalSettings = require('./routes/Settings/generalSetting');
const admin = require('./routes/userRoute');
app.use('/api/v1', generalSettings);
app.use('/api/v1', admin);
app.use(express.static(path.join('http://localhost:3000/')));
app.get('*', (req, res) => {
	res.sendFile(path.resolve('http://localhost:3000/'));
});
// Middleware for Errors
app.use(errorMiddleware);
module.exports = app;
