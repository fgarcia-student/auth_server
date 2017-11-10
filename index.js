//main starting point of application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./router');

const app = express();

//db setup
mongoose.connect('mongodb://localhost/users', {useMongoClient: true});

//app setup--express
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json({type:'*/*'}));

router(app);

//server setup--express talks to outside world
const port = process.env.PORT || 3001;
const server = http.createServer(app);
server.listen(port);
console.log('server listening on:', port);
