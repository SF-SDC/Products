const express = require('express');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products', (req, res) => {
  // get array of product objects
  // TODO: handle page and count requests
  let page = 1;
  let count = 5;
  if (req.query.page && parseInt(req.query.page, 10) > 1) {
    page = parseInt(req.query.page, 10);
  }
  if (req.query.count && parseInt(req.query.count, 10) > 0) {
    count = parseInt(req.query.count, 10);
  }
  db.getProducts(page - 1, count + 1)
    .then((results) => res.send(results.rows))
    .catch((err) => res.status(500).send(err.body));
});

app.get('/products/:id', (req, res) => {
  // get all product info, plus array of features
  console.log('Reqest to: ', req.url, req.params);
  Promise.all(([db.getProductByID(req.params.id), db.getFeaturesByID(req.params.id)]))
    .then((values) => {
      const result = values[0].rows[0];
      result.features = values[1].rows.flat();
      res.send(result);
    })
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
