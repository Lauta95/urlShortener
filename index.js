require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  console.log(req.body);
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl', (req, res) => {


  res.json({ greeting: 'hello API' });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
