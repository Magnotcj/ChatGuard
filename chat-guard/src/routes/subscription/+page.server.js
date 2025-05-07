import { addPersonToSubscription } from '$lib/server/database.js';
import { fail } from '@sveltejs/kit';
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
            return fail(500, { error: 'Failed to create report.' });
          }
        }
      };