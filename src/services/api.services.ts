import axios from 'axios';
import { config } from '../constants';

const { discord } = config;

export async function discord_getAccessToken(code: string) {
  return await axios({
    method: 'post',
    url: 'https://discord.com/api/oauth2/token',
    data: {
      client_id: discord.clientId,
      client_secret: discord.clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: discord.redirectUri,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function discord_getUserGuilds(token: string) {
  return await axios('https://discord.com/api/users/@me/guilds', {
    headers: { authorization: token },
  });
}

export async function discord_getBotGuilds() {
  return await axios('https://discord.com/api/users/@me/guilds', {
    headers: { authorization: `Bot ${discord.token}` },
  });
}

export async function discord_getUserInfo(token: string) {
  return await axios('https://discord.com/api/users/@me', {
    headers: { authorization: token },
  });
}
