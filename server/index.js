const express = require('express');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products', (req, res) => {
  // get array of product objects
  // TODO: handle page and count requests
  console.log('Reqest to: ', req.url, req.params);
  db.getProducts()
    .then((results) => res.send(results.rows))
    .catch((err) => res.status(500).send(err.body));
});

app.get('/products/:id', (req, res) => {
  // get all product info, plus array of features
  console.log('Reqest to: ', req.url, req.params);
  db.getProductWithFeatures(req.params.id)
    .then((results) => res.send(results.rows))
    .catch((err) => res.status(500).send(err.body));
});

app.get('/products/:id/styles', (req, res) => {
  // get product_id, plus array of styles {product_id: 1, results: []}
  console.log('Reqest to: ', req.url, req.params);
  db.getStyles(req.params.id)
    .then((results) => res.send(results.rows))
    .catch((err) => res.status(500).send(err.body));
});

app.get('/products/:id/related', (req, res) => {
  // get array of related styles [2,3,4]
  console.log('Reqest to: ', req.url, req.params);
  db.getRelated(req.params.id)
    .then((results) => res.send(results.rows))
    .catch((err) => res.status(500).send(err.body));
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
