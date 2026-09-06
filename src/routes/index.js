const collectionsRouter = require('./collections');
const siteRouter = require('./site');
const productsRouter = require('./products');
const searchsRouter = require('./search');
const apisRouter = require('./apis');
const ordersRouter = require('./order');
const discountsRouter = require('./discount');
const adminsRouter = require('./admin');
const policysRouter = require('./policy');

function route(app) {
  // http method

  app.use('/collections', collectionsRouter);
  app.use('/products', productsRouter);
  app.use('/search', searchsRouter);
  app.use('/apis', apisRouter);
  app.use('/order', ordersRouter);
  app.use('/discount', discountsRouter);
  app.use('/admin', adminsRouter);
  app.use('/policy', policysRouter);

  app.use('/', siteRouter);
}

module.exports = route;
