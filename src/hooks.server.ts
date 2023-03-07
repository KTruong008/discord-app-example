import type { Handle } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { verifyKey } from 'discord-interactions';
import { APP_ID, DISCORD_PUBLIC_KEY, DISCORD_TOKEN } from '$env/static/private';

import { discordRequest } from '$lib/shared/shared-utils';
import { GLOBAL_COMMANDS } from '$lib/shared/shared.constant';

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

  /**
   * Guild commands installer
   *
   * Guilds = servers?
   */
  const globalCommandsEndpoint = `applications/${APP_ID}/commands`;
  const installedGlobalCommands = await discordRequest(
    globalCommandsEndpoint,
    DISCORD_TOKEN,
    {
      method: 'GET'
    }
  );

  if (Array.isArray(installedGlobalCommands)) {
    const installedGlobalCommandsNames = installedGlobalCommands.map(
      (command) => command.name
    );

    GLOBAL_COMMANDS.forEach(async (globalCommand) => {
      const shouldInstallCommand = !installedGlobalCommandsNames.includes(
        globalCommand.name
      );

      if (shouldInstallCommand) {
        await discordRequest(`applications/${APP_ID}/commands`, DISCORD_TOKEN, {
          method: 'POST',
          body: {
            ...globalCommand
          }
        });
      }
    });
  }

  /**
   * Discord request authentication
   */
  const isDiscordInteraction = event.url.pathname.startsWith('/api/interaction');

  if (isDiscordInteraction) {
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
