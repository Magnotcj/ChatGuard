import { addPersonToSubscription } from '$lib/server/database.js';
export const actions = {
    create: async ({ request, cookies }) => {
      const data = await request.formData();
          const subscriptionType = data.get('subscriptionType');