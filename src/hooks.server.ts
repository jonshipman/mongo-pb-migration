import { MongoClient } from 'mongodb';
import Pocketbase from 'pocketbase';

import { POCKETBASE_URL, MONGO_URL } from '$env/static/private';

const allowedHeaders = ['retry-after', 'content-type'];

const POCKETBASE_CLIENT = new Pocketbase(POCKETBASE_URL);
const MONGO_CLIENT = new MongoClient(MONGO_URL);
const MONGO_CONNECTION = MONGO_CLIENT.connect();

export async function handle({ event, resolve }): Promise<Response> {
	if (!event.locals.mongo) {
		event.locals.mongo = MONGO_CLIENT;
		await MONGO_CONNECTION;
	}

	event.locals.mongoWeather = event.locals.mongo.db().collection('weatherAlert');

	event.locals.pb = POCKETBASE_CLIENT;
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = structuredClone(event.locals.pb.authStore.model);
	} else {
		event.locals.user = undefined;
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => allowedHeaders.includes(name)
	});

	response.headers.set(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ secure: POCKETBASE_URL.startsWith('https') })
	);

	return response;
}
