import { error, redirect } from '@sveltejs/kit';
import type { LoginBody } from './login';

export const actions = {
	async login({ locals, request }) {
		const bodyRaw = Object.fromEntries(await request.formData()) as unknown;
		const body = bodyRaw as LoginBody;

		try {
			await locals.pb.admins.authWithPassword(body.email, body.password, {
				autoRefreshThreshold: 30 * 60
			});
		} catch (e) {
			console.error('Error:', e);
			throw error(500, 'Something went wrong');
		}

		throw redirect(303, '/');
	}
};
