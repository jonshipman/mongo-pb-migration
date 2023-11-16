import type { Collection, Document, MongoClient } from 'mongodb';

declare global {
	interface PbRecord {
		collectionId: string;
		collectionName: string;
		id: string;
		created: string;
		updated: string;
	}

	interface PbFilter {
		filter?: string;
		sort?: string;
		expand?: string;
	}

	interface User extends PbRecord {}

	interface List<T> {
		page: number;
		perPage: number;
		totalItems: number;
		totalPages: number;
		items: T[];
	}

	interface WeatherAlertReference {
		'@id': string;
		identifier: string;
		sender: string;
		sent: string;
	}

	interface WeatherAlert extends PbRecord {
		active: boolean;
		effective: string;
		geometry: { coordinates: number[][][]; type: string };
		hailSize: number;
		windGust: number;
		noaaId: string;
		properties: {
			'@id': string;
			'@type': string;
			affectedZones: string[];
			areaDesc: string;
			category: string;
			certainity: string;
			description: string;
			effective: string;
			ends: string;
			event: string;
			expires: string;
			geocode: { SAME: string[]; UGC: string[] };
			headline: string;
			id: string;
			instruction: string;
			messageType: string;
			onset: string;
			parameters: {
				AWIPSidentifier: string[];
				BLOCKCHANNEL: string[];
				'EAS-ORG': string[];
				NWSheadline: string[];
				VTEC: string[];
				WMOidentifier: string[];
				eventEndingTime: string[];
			};
			references: WeatherAlertReference[];
			response: string;
			sender: string;
			senderName: string;
			sent: string;
			severity: string;
			status: string;
			urgency: string;
		};
		state: string;
	}

	namespace App {
		interface Locals {
			mongoWeather: Collection<Document>;
			mongo: MongoClient;
			pb: Pocketbase;
			user: User | undefined;
		}
	}
}

export { };

