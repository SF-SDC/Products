const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getProducts = (min, max) => pool.query(`SELECT * FROM products WHERE id>${min} AND id<${max};`);

const getProductByID = (id) => {
  const queryString = `SELECT *,
  (SELECT ARRAY(SELECT row_to_json(X) FROM (SELECT feature, value FROM features WHERE product_id=${id}) AS X) AS features)
  FROM products WHERE id=${id} LIMIT 1`;
  return pool.query(queryString);
};

const getStylesByID = (id) => {
  const queryString = `SELECT styles.style_id, styles.name, styles.original_price, styles.sale_price, styles."default?",
  (SELECT ARRAY (SELECT to_json(pics) FROM (SELECT photos.url, photos.thumbnail_url FROM photos WHERE photos.style_id=styles.style_id) AS pics)) AS photos,
  (SELECT json_object_agg(skus.sku, json_build_object('quantity',skus.quantity,'size',skus.size)) FROM skus WHERE skus.style_id=styles.style_id) AS skus
 FROM styles WHERE styles.product_id=${id}`;
  return pool.query(queryString);
};

const getRelated = (id) => {
  const queryString = `SELECT ARRAY(SELECT related_id FROM related WHERE product_id=${id})`;
  return pool.query(queryString);
};

exports.getProducts = getProducts;
exports.getProductByID = getProductByID;
exports.getStylesByID = getStylesByID;
exports.getRelated = getRelated;
