/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
require('jest');
const request = require('supertest');
const server = require('../server/app');

describe('Product API test suite', () => {
  it('should reject an invalid route', async () => {
    const response = await request(server).get('/');
    expect(response.statusCode).toBe(404);
  });
  it('should reject an invalid verb', async () => {
    const response = await request(server).post('/products');
    expect(response.statusCode).toBe(404);
  });
  it('should return products in the expected format', async () => {
    const response = await request(server).get('/products');
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(5);
    expect(response.body[0].id).toBe(1);
    expect(response.body[0].name).toBe('Camo Onesie');
    expect(response.body[0].slogan).toBe('Blend in to your crowd');
    expect(typeof response.body[0].description).toBe('string');
    expect(response.body[0].default_price).toBe('140.00');
  });
  it('should return the correct products given page and count values', async () => {
    const response = await request(server).get('/products?page=11&count=10');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(10);
    expect(response.body[0].id).toBe(101);
    expect(response.body[9].id).toBe(110);
  });
  it('should return the correct fields for /prodcuts/:product_id', async () => {
    const response = await request(server).get('/products/7000');
    expect(response.statusCode).toBe(200);
    expect(typeof response.body).toBe('object');
    expect(Array.isArray(response.body)).toBe(false);
    expect(response.body.hasOwnProperty('id')).toBe(true);
    expect(response.body.hasOwnProperty('name')).toBe(true);
    expect(response.body.hasOwnProperty('slogan')).toBe(true);
    expect(response.body.hasOwnProperty('description')).toBe(true);
    expect(response.body.hasOwnProperty('category')).toBe(true);
    expect(response.body.hasOwnProperty('default_price')).toBe(true);
    expect(response.body.hasOwnProperty('features')).toBe(true);
    expect(Array.isArray(response.body.features)).toBe(true);
  });
  it('should return the correct fields for /prodcuts/:product_id/styles', async () => {
    const response = await request(server).get('/products/7000/styles');
    expect(response.statusCode).toBe(200);
    expect(typeof response.body).toBe('object');
    expect(Array.isArray(response.body)).toBe(false);
    expect(response.body.hasOwnProperty('product_id')).toBe(true);
    expect(response.body.hasOwnProperty('results')).toBe(true);
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(response.body.results[0].hasOwnProperty('style_id')).toBe(true);
    expect(response.body.results[0].hasOwnProperty('name')).toBe(true);
    expect(response.body.results[0].hasOwnProperty('original_price')).toBe(true);
    expect(response.body.results[0].hasOwnProperty('sale_price')).toBe(true);
    expect(response.body.results[0].hasOwnProperty('default?')).toBe(true);
    expect(response.body.results[0].hasOwnProperty('photos')).toBe(true);
    expect(Array.isArray(response.body.results[0].photos)).toBe(true);
    expect(response.body.results[0].hasOwnProperty('skus')).toBe(true);
    expect(typeof response.body.results[0].skus).toBe('object');
    expect(Array.isArray(response.body.results[0].skus)).toBe(false);
  });
  it('should return an array of IDs for /prodcuts/:product_id/related', async () => {
    const response = await request(server).get('/products/568345/related');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((related) => expect(typeof related).toBe('number'));
  });
});
