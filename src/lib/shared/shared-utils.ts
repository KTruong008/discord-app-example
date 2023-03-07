export const throwIfHttpError = (response: any) => {
  if (!response.ok) {
    const formattedErrorString = `${response.status} - ${
      response.statusText
    }: ${JSON.stringify(response)}`;
    throw new Error(formattedErrorString);
  }

  return response;
};

export const readResponseStreamAsJson = (responseStream: any) => {
  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/Body/json
   * https://stackoverflow.com/questions/52252848/how-to-get-response-body-and-response-headers-in-one-block
   *
   * Responses coming from 'fetch' return as a stream.
   * Since the app works in objects, the stream must be read
   * to completion to be converted into an object,
   * and it needs to know what type of data to read the stream as (json).
   */
  return responseStream.json();
};

export const discordRequest = async (
  endpoint: string,
  botToken: string,
  options: Record<string, any>
) => {
  const url = 'https://discord.com/api/v10/' + endpoint;
  if (options.body) options.body = JSON.stringify(options.body);

  return await fetch(url, {
    headers: {
      Authorization: `Bot ${botToken}`,
      'Content-Type': 'application/json; charset=UTF-8'
      // 'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)'
    },
    ...options
  })
    .then(throwIfHttpError)
    .then(readResponseStreamAsJson);
};
