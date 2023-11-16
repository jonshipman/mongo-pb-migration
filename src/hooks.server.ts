import { MongoClient } from 'mongodb';
import Pocketbase from 'pocketbase';

import { POCKETBASE_URL, MONGO_URL } from '$env/static/private';

const allowedHeaders = ['retry-after', 'content-type'];

export async function handle({ event, resolve }): Promise<Response> {
	console.log('connecting to mongo...');
	event.locals.mongo = new MongoClient(MONGO_URL);
	await event.locals.mongo.connect();
	console.log('...connected to mongo');

	event.locals.mongoWeather = event.locals.mongo.db().collection('weatherAlert');

	event.locals.pb = new Pocketbase(POCKETBASE_URL);
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = structuredClone(event.locals.pb.authStore.model);
	} else {
		event.locals.user = undefined;
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => allowedHeaders.includes(name)
	});

	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: true }));

	return response;
}
