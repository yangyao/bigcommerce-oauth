'use strict';

const koa = require('koa');
const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');
const request = require('request-promise');
const config = require('config');

const app = new koa();
app.use(koaBody());
app.use(logger());
router.get('/callback', login);
app.use(router.routes());

async function login(ctx) {
	const response_object = ctx.request.query;
	logger.info(response_object);
	const response = await request({
		url: 'https://login.bigcommerce.com/oauth2/token',
		method: 'POST',
		headers: {
			Accept: 'application/json',
		},
		json: true,
		form: {
			client_id: config.client_id,
			client_secret: config.client_secret,
			code: response_object.code,
			context: response_object.context,
			grant_type: 'authorization_code',
			redirect_uri: config.redirect_uri,
			scope: response_object.scope,
		},
		resolveWithFullResponse: true,
	});
	logger.info(response);
	ctx.body = response.body;
}

app.listen(3000);
