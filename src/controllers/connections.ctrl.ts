import { type Request, type Response } from "express";
import { response, exceptionResponse } from "../api/response";
import { TwitterApi } from "twitter-api-v2";
import { config } from "../constants";
import { Connection } from "../database/models/connection.model";
import { UnauthorizedError } from "../utils/exceptions";

export default class ConnectionsController {
  private XClient: TwitterApi;

  constructor() {
    this.XClient = new TwitterApi({
      clientId: config.X.clientId,
      clientSecret: config.X.clientSecret,
    });
  }

  public X = {
    index: async (req: Request, res: Response) => {
      try {
        const { code, code_verifier } = req.body;
        const { accessToken, refreshToken } =
          await this.XClient.loginWithOAuth2({
            code,
            codeVerifier: code_verifier,
            redirectUri: config.X.redirectUri,
          });

        const userClient = new TwitterApi(accessToken).v2;
        const userResponse = await userClient.me();
        if (!userResponse) {
          throw new UnauthorizedError("User not found.");
        }

        await Connection.updateOne(
          { user: res.locals.user._id, type: "x" },
          {
            $set: {
              access_token: accessToken,
              refresh_token: refreshToken,
              data: userResponse.data,
            },
          },
          { upsert: true },
        );

        return response(res, {
          code: 201,
          success: true,
          message: "Successfully logged in with X.",
        });
      } catch (error: any) {
        return exceptionResponse(res, error);
      }
    },
    authLink: (_: Request, res: Response) => {
      try {
        const link = this.XClient.generateOAuth2AuthLink(config.X.redirectUri, {
          scope: ["tweet.read", "users.read", "offline.access"],
        });

        return response(res, {
          code: 201,
          success: true,
          message: "Twitter authorization link successfully generated.",
          data: { url: link.url, code_verifier: link.codeVerifier },
        });
      } catch (error: any) {
        return exceptionResponse(res, error);
      }
    },
  };
}
