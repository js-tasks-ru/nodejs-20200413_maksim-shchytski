const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = [];

router.get('/subscribe', async (ctx, next) => {
  let message = '';

  const promise = new Promise((resolve, reject) => {
    subscribers = subscribers.concat(resolve);
  });

  try {
    message = await promise;
  } catch (error) {
    console.error(error);
  }

  ctx.body = message;

  return next();
});

router.post('/publish', async (ctx, next) => {
  const { message } = ctx.request.body;

  if (!message) {
    ctx.throw(400);
  }

  subscribers.forEach((resolve) => resolve(message));

  ctx.status = 200;

  return next();
});

app.use(router.routes());

module.exports = app;
