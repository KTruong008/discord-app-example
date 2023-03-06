import type { Handle } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { verifyKey } from 'discord-interactions';
import { DISCORD_PUBLIC_KEY } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
  const requestMethod = event.request?.method?.toUpperCase?.() || '';

  /**
   * CORS
   */
  if (requestMethod === 'OPTIONS') {
    // https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
    return new Response('{}', {
      status: 204,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*'
      }
    });
  }

  const isDiscordRequest = event.url.pathname.startsWith('/api/interactions');

  /**
   * Discord request authentication
   */
  if (isDiscordRequest) {
    const signature = event.request.headers.get('X-Signature-Ed25519');
    const timestamp = event.request.headers.get('X-Signature-Timestamp');
    const clonedRequest = event.request.clone();
    const rawBody = await clonedRequest.text();

    let isValidRequest = false;
    if (signature && timestamp) {
      isValidRequest = verifyKey(rawBody, signature, timestamp, DISCORD_PUBLIC_KEY);
    }

    console.log('isValidDiscordRequest: ', isValidRequest);

    if (!isValidRequest) {
      throw error(401, 'Invalid discord request');
    }
  }

  const response = await resolve(event);

  /**
   * More CORS
   */
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Headers', '*');
  response.headers.set('Access-Control-Allow-Methods', '*');

  return response;
};
