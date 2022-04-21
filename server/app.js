const express = require('express');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products', (req, res) => {
  // get array of product objects
  // TODO: handle page and count requests
  let page = 0;
  let count = 5;
  if (req.query.page && parseInt(req.query.page, 10) > 1) {
    page = parseInt(req.query.page, 10) - 1;
  }
  if (req.query.count && parseInt(req.query.count, 10) > 0) {
    count = parseInt(req.query.count, 10);
  }
  console.log('Page, count: ', page, count);
  db.getProducts((page * count), (page * count) + count + 1)
    .then((results) => {
      res.send(results.rows);
    })
    .catch((err) => res.status(500).send(err.body));
});

app.get('/products/:id', (req, res) => {
  // get all product info, plus array of features
  db.getProductByID(req.params.id)
    .then((values) => {
      res.send(values.rows[0]);
    })
    .catch((err) => res.status(500).send(err.body));
});

app.get('/products/:id/styles', (req, res) => {
  // get product_id, plus array of styles {product_id: 1, results: []}
  db.getStylesByID(req.params.id)
    .then((styles) => {
      const response = {
        product_id: req.params.id,
        results: styles.rows,
      };
      res.send(response);
    })
    .catch((err) => res.status(500).send(err.body));
});

app.get('/products/:id/related', (req, res) => {
  // get array of related styles [2,3,4]
  db.getRelated(req.params.id)
    .then((results) => res.send(results.rows[0].array))
    .catch((err) => res.status(500).send(err.body));
});

module.exports = app;