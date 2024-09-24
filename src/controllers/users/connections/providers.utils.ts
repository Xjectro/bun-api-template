import { UnauthorizedError } from "../../../api/commons/exceptions";
import {
  discord_getAccessToken,
  discord_getUserInfo,
} from "../../../services/api.services";
import { saveConnection } from "../../../services/db.services";

export default class ConnectionsHelpers {
  async discord(_id: string, code: string) {
    const response = await discord_getAccessToken(code);

    if (!response?.data?.access_token)
      throw new UnauthorizedError("Error connecting to Discord");

    const userInfo = await discord_getUserInfo(
      `Bearer ${response.data.access_token} `,
    );

    if (!userInfo.data)
      throw new UnauthorizedError("Error connecting to Discord 2");

    await saveConnection({
      type: "discord",
      user: _id,
      data: userInfo.data,
      tokens: {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      },
    });

    return userInfo.data;
  }
}
