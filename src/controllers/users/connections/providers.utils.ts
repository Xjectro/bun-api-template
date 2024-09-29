import { UnauthorizedError } from '../../../api/commons/exceptions';
import { discord_getAccessToken, discord_getUserInfo } from '../../../services/api.service';
import { Connection } from '../../../database/models/connection.model';
import { ObjectId } from 'mongoose';

export default class ConnectionsHelpers {
  async discord(_id: ObjectId, code: string) {
    const response = await discord_getAccessToken(code);

    if (!response?.data?.access_token) throw new UnauthorizedError('Error connecting to Discord');

    const userInfo = await discord_getUserInfo(`Bearer ${response.data.access_token} `);

    if (!userInfo.data) throw new UnauthorizedError('Error connecting to Discord 2');

    await Connection.save({
      type: 'discord',
      user: _id,
      data: userInfo.data,
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    });

    return userInfo.data;
  }
}
