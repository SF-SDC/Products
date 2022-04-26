const app = require('./app');

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.argv[2] || process.env.PORT}`);
});
