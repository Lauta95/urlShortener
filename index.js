require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb')
const dns = require('dns')
const urlparser = require('url')

const client = new MongoClient(process.env.MONGO_URI)
const db = client.db('urlshortner')
const urls = db.collection('urls')
// no mongoose porque no es necesario

// Basic Configuration
const port = process.env.PORT || 3030;

// middlewares para tener la respuesta de los json con los requests.
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', (req, res) => {
  console.log(req.body);
  const { url } = req.body
  // EN NODE.JS: dns.lookup( hostname, options, callback ) -> es un api del modulo dns que es usado para resolver direcciones de ip. acá usamos hostname y el callback con su error y la dirección
  const dnslookup = dns.lookup(urlparser.parse(url).hostname, async (err, address) => {
    if (!address) {
      res.json({ error: "invalid url" })
    } else {
      const urlCount = await urls.countDocuments({})
      const urlDoc = {
        url,
        short_url: urlCount
      }
      const result = await urls.insertOne(urlDoc)
      console.log(result);
      res.json({ original_url: url, short_url: urlCount })
    }
  })
});

app.get('/api/shorturl/:short_url', async(req, res) => {
  const shorturl = req.params.short_url
  // +shorturl para transformarlo en numero
  const urlDoc = await urls.findOne({short_url: +shorturl})
  res.redirect(urlDoc.url)
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
