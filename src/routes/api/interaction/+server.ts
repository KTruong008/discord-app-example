import { json, type RequestEvent } from '@sveltejs/kit';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes
} from 'discord-interactions';

export const POST = async (event: RequestEvent) => {
  const requestBody = await event.request.json();
  const { type, id, data } = requestBody;

  console.log('posting');

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    console.log('PING: ', requestBody);
    return json({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    console.log('APPLICAITON_COMMAND: ', requestBody);
    return json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'Hello world!'
      }
    });
  }

  /**
   * Handle requests from interactive components
   * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
   */
  if (type === InteractionType.MESSAGE_COMPONENT) {
    console.log('MESSAGE_COMPONENT: ', requestBody);
    return json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'Hello world!'
      }
    });
  }

  return json({});
};
