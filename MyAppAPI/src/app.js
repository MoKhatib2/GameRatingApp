const express = require('express');
require("dotenv").config();
var logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const MongoURI = process.env.MONGO_URI

app.use(logger('dev'));
//app.use(express.json());
app.use(bodyParser.json());
app.use(cors({origin: "http://localhost:4200", credentials: true}));
app.set('port', port);

mongoose.set('strictQuery', false);
mongoose.connect(MongoURI)
  .then(connection => {
      console.log("Conneted to mongoDB")

      app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
      });

  }).catch(err => console.log(err));


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const publicRouter = require('./routes/public');
const privateRouter = require('./routes/private'); 

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/public', publicRouter);
app.use('/private', privateRouter);

