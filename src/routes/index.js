const productsRouter = require('./products');
const countriesRouter = require('./countries');

module.exports = {
  '/products': productsRouter,
  '/countries': countriesRouter,
};
