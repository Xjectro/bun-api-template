import { type Request, type Response } from 'express';
import { exceptionResponse, response } from '../../api/commons/response';
import CDNHelpers from './helpers.utils';
import { InternalServerError } from '../../api/commons/exceptions';
import { uploadFile } from '../../services/cdn.service';

export default class CDNController {
  private helpers = new CDNHelpers();

  uploadFile = async (req: Request, res: Response) => {
    try {
      const attachment = (req.files as any)?.attachment[0];

      if (!attachment) {
        throw new InternalServerError('No file uploaded');
      }

      const uploadResponse = await uploadFile(attachment);

      return response(res, {
        code: 201,
        success: true,
        message: 'File uploaded.',
        data: uploadResponse,
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };
}
