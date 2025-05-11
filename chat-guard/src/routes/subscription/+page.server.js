import { addPersonToSubscription, validateToken } from '$lib/server/database.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
  const sessionId = cookies.get('session_id') || "";

  try {
	  await validateToken(sessionId);
	} catch (error) {
	  throw redirect(308, '/');
	}
}

export const actions = {
    create: async ({ request, cookies }) => {
      const data = await request.formData();
      const sessionId = cookies.get('session_id') || "";
        const subscriptionType = data.get('subscriptionType');
        try {
            await addPersonToSubscription(+subscriptionType, sessionId);
            return { success: true };
          } catch (error) {
            console.error('Database error:', error);
            return fail(500, { error: 'Failed to update subscription.' });
          }
        },
        
      cancel: async ({ request, cookies }) => {
        const data = await request.formData();
        const sessionId = cookies.get('session_id') || "";
        try {
            await addPersonToSubscription(0, sessionId);
          } catch (error) {
            console.error('Database error:', error);
            return fail(500, { error: 'Failed to cancel subscription.' });
          }
        },
      
      
      };