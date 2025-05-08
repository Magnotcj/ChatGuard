import { addPersonToSubscription } from '$lib/server/database.js';
import { fail, redirect } from '@sveltejs/kit';
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