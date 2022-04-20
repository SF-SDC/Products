const { Pool } = require('pg');

const pool = new Pool({
  user: 'sdc_connection',
  host: 'localhost',
  database: 'sdc_test',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getProducts = (min, max) => pool.query(`SELECT * FROM products WHERE id>${min} AND id<${max};`);

const getProductByID = (id) => {
  const queryString = `SELECT * FROM products WHERE id=${id}`;
  return pool.query(queryString);
};

const getFeaturesByID = (id) => {
  const queryString = `SELECT row_to_json(X) FROM (SELECT feature, value FROM features WHERE product_id=${id}) AS X`;
  const query = {
    text: queryString,
    rowMode: 'array',
  };
  return pool.query(query);
};

const getStylesByID = (id) => {
  // ToDo: join with photos and SKUs, remove product ID
  const queryString = `SELECT * FROM styles WHERE product_id=${id}`;
  return pool.query(queryString);
};

const getPhotosByID = (id) => {
  // ToDo: join with photos and SKUs, remove product ID
  const queryString = `SELECT style_id, url, thumbnail_url FROM photos WHERE photos.style_id IN (SELECT style_id FROM styles WHERE product_id=${id})`;
  const query = {
    text: queryString,
    // rowMode: 'array',
  };
  return pool.query(query);
};

const getRelated = (id) => {
  const queryString = `SELECT related_id FROM related WHERE product_id=${id}`;
  return pool.query(queryString);
};

exports.getProducts = getProducts;
exports.getProductByID = getProductByID;
exports.getFeaturesByID = getFeaturesByID;
exports.getStylesByID = getStylesByID;
exports.getPhotosByID = getPhotosByID;
exports.getRelated = getRelated;
