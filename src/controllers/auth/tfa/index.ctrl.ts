import { type Request, type Response } from 'express';
import { exceptionResponse, response } from '../../../api/commons/response';
import { Auth } from '../../../database/models/auth.model';
import { Tfa } from '../../../database/models/tfa.model';
import { generateJWT } from '../../../utils/modules/jwt';

export default class AuthTfaController {
    index = async (req: Request, res: Response) => {
        try {
            const user = res.locals.user;
            const { enabled } = req.body;

            const auth = await Auth.findOne({ user: user._id });

            if (!auth) return;

            auth.tfa = enabled;

            await auth.save();

            return response(res, {
                code: 201,
                success: true,
                message: 'Successfully update two factor.',
            });
        } catch (error: any) {
            return exceptionResponse(res, error);
        }
    };

    verify = async (req: Request, res: Response) => {
        try {
            const { usage_code, interaction } = req.body;

            const tfa = await Tfa.checkTfa({ usage_code });

            const data: any = {
                expiration: tfa.expiration,
                access_token: generateJWT(
                    {
                        id: tfa.user._id,
                    },
                    30 * 24 * 60 * 60,
                ),
            };

            if (interaction === 'login') {
                const auth = await Auth.findOne({ user: tfa.user._id });
                data.refresh_token = auth?.refresh_token;
            }

            return response(res, {
                code: 201,
                success: true,
                message: 'Usage code is correct',
                data,
            });
        } catch (error: any) {
            return exceptionResponse(res, error);
        }
    };
}
