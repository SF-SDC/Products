const { Pool } = require('pg');

const pool = new Pool({
  user: 'sdc_connection',
  host: 'localhost',
  database: 'sdc_test',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getProducts = () => pool.query('SELECT * FROM products WHERE id<10');

const getProductWithFeatures = (id) => {
  // ToDo: join with features
  console.log('ID param: ', id);
  const queryString = `SELECT * FROM products WHERE id=${id}`;
  return pool.query(queryString);
};

const getStyles = (id) => {
  // ToDo: join with photos and SKUs, remove product ID
  const queryString = `SELECT * FROM styles WHERE product_id=${id}`;
  return pool.query(queryString);
};

const getRelated = (id) => {
  const queryString = `SELECT related_id FROM related WHERE product_id=${id}`;
  return pool.query(queryString);
};

exports.getProducts = getProducts;
exports.getProductWithFeatures = getProductWithFeatures;
exports.getStyles = getStyles;
exports.getRelated = getRelated;
