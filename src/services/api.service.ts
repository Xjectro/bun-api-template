import axios from 'axios';

const{DISCORD_CLIENT_SECRET,DISCORD_CLIENT_ID,DISCORD_TOKEN,DISCORD_REDIRECT_URI}=process.env

export async function discord_getAccessToken(code: string) {
  return await axios({
    method: 'post',
    url: 'https://discord.com/api/oauth2/token',
    data: {
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: DISCORD_REDIRECT_URI,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function discord_getUserInfo(token: string) {
  return await axios('https://discord.com/api/users/@me', {
    headers: { authorization: token },
  });
}
