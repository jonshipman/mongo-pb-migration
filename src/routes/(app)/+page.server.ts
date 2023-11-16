import { states } from './states';

/* eslint-disable @typescript-eslint/no-explicit-any */
function getStringHailSize(data: any) {
	let maxHailSize = '0.00';

	try {
		maxHailSize = data.properties.parameters.maxHailSize[0] || maxHailSize;
	} catch (e) {
		maxHailSize = '0.00';
	}

	maxHailSize = maxHailSize.replace('Up to ', '');

	return maxHailSize;
}

function getHailSize(data: any) {
	const hailSize = getStringHailSize(data);
	return parseFloat(hailSize);
}

function getWindGust(data: any) {
	let windGust = 0;

	try {
		let gust = data.properties.parameters.maxWindGust[0] || '0';
		gust = gust.replace('Up to ', '');
		gust = gust.replace(' MPH', '');
		windGust = parseInt(gust);
	} catch (e) {
		// noop.
	}

	return windGust;
}

function formatDate(date: Date) {
	if (!date) return date;
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');
	const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

export const actions = {
	async test({ locals }) {
		const collections = await locals.mongo.db().listCollections().toArray();
		const weatherAlertCount = await locals.mongoWeather.estimatedDocumentCount();
		const record = await locals.pb
			.collection('weather_alert')
			.getFirstListItem('active = true', { sort: '-effective' });

		return {
			collections: collections.map((e) => e.name),
			weather: { count: weatherAlertCount },
			pocketbaseTestRecord: record
		};
	},
	async write({ locals }) {
		let done = true;
		const cursor = locals.mongoWeather
			.find({ _migrated: { $exists: false }, state: { $in: states } })
			.limit(50);
		const updated = [];

		for await (const doc of cursor) {
			done = false;
			const noaaId = doc.properties['@id'];

			const record = {
				noaaId,
				active: false,
				geometry: doc.geometry,
				hailSize: getHailSize(doc),
				state: doc.state,
				properties: {
					...doc.properties,
					effective: formatDate(doc.properties.effective),
					ends: formatDate(doc.properties.ends),
					expires: formatDate(doc.properties.expires),
					onset: formatDate(doc.properties.onset),
					sent: formatDate(doc.properties.sent)
				},
				effective: formatDate(doc.properties.effective),
				windGust: getWindGust(doc)
			};

			let pbrecord;

			try {
				pbrecord = await locals.pb
					.collection('weather_alert')
					.getFirstListItem(`noaaId = "${noaaId}"`);
			} catch (e) {
				// noop.
			}

			let response;

			try {
				if (!pbrecord) {
					response = await locals.pb.collection('weather_alert').create(record);
				} else {
					response = await locals.pb.collection('weather_alert').update(pbrecord.id, record);
				}
			} catch (e: unknown) {
				const error = e as Error & { originalError: { data: { data: unknown } } };
				error?.originalError && console.error(error.originalError);
			}

			try {
				if (response?.id) {
					await locals.mongoWeather.updateOne({ _id: doc._id }, { $set: { _migrated: true } });

					updated.push(noaaId);
				}
			} catch (e: unknown) {
				const error = e as Error & { originalError: { data: { data: unknown } } };
				error?.originalError && console.error(error.originalError);
			}
		}

		return { done, updated };
	}
};
