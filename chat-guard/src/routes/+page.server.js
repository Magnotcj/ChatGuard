import { fail, redirect } from '@sveltejs/kit';
import { createUser, getHashedPassword, validateToken } from '$lib/server/database.js'; // Ensure this function exists and works as expected
import bcrypt from 'bcrypt'; // Hashing library
import { dev } from '$app/environment';
import { showModal } from './store.js'; 
import { generateSessionToken, createSession } from "../lib/server/session"

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
  const id = cookies.get("session_id");

  if (id == undefined) {
    cookies.set('session_id', '', {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: !dev,
        
    });
    return;
  }
  if (id == '') {
    return;
  }

  try {
      await validateToken(id);
  } catch (error) {
    cookies.set('session_id', '', {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: !dev,
        
    });
    return;
  }
  throw redirect(308, '/dashboard');
}

async function hashPassword(password) {
  // Generate the salt
  const salt = await bcrypt.genSalt(10); // 10 is the cost factor
  
  // Hash the password with the generated salt
  const hashedPassword = await bcrypt.hash(password, salt);

  return { hashedPassword, salt };
}


export const actions = {
  create: async ({ request, cookies }) => {
    const formData = new URLSearchParams(await request.text());
    const username = formData.get('username');
    const password = formData.get('password');

    // Validate required fields
    if (!username || !password) {
      return fail(400, { error: 'Username and password are required.' });
    }
    if (username.split(' ').length > 1) {
      return fail(400, { error: 'Username cannot have any spaces.' });
    }

    try {
      // Hash the password
      const { hashedPassword } = await hashPassword(password);

      // Save the username and hashed password to the database
      await createUser(username, hashedPassword);
      // const token = generateSessionToken();
      // const session = await createSession(token, username);
      // cookies.set('session_id', token, {
      //   path: '/',
      //   httpOnly: true,
      //   sameSite: 'strict',
      //   secure: !dev,
      
      // });
      showModal.set(true);
      return { success: true, message: 'Account created successfully' };
    } catch (error) {
      console.error('Database error:', error);
      return fail(500, { error: 'Failed to create account.' });
    }
  },

  login: async ({ request, cookies }) => {
    const formData = new URLSearchParams(await request.text());
    const username = formData.get('username');
    const password = formData.get('password');
    let isTrue = false;
    
    // Validate required fields
    if (!username || !password) {
      return fail(400, { error: 'Username and password are required.' });
    }

    try {
      const userHashedPw = await getHashedPassword(username);
      console.log("account data is ", username, userHashedPw)
      if (!username || !userHashedPw) {
        return fail(401, { error: 'Invalid user information.' });
      }
      const isPasswordCorrect = await bcrypt.compare(password, String (userHashedPw));

      if (!isPasswordCorrect) {
        return fail(401, { error: 'Invalid username or password.' });
      } 
      isTrue = true;

      const token = generateSessionToken();
      const session = await createSession(token, username);
      cookies.set('session_id', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: !dev,
      });
    } catch (error) {
      console.error('Login error:', error);
      return fail(500, { error: 'Failed to log in.' });
    }
    if(isTrue){
      throw redirect(303, '/dashboard'); 
    }
  },
}