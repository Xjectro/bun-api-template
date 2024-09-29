import { type Request, type Response } from 'express';
import { exceptionResponse, response } from '../../../api/commons/response';
import { DuplicatedDataError, NotFoundError } from '../../../api/commons/exceptions';
import { Category } from '../../../database/models/category.model';

export default class AppCategoriesController {
  add = async (req: Request, res: Response) => {
    try {
      const { iconURL, name, code } = req.body;

      const category = await Category.findOne({ code });

      if (category) {
        throw new DuplicatedDataError('You cannot recreate it from the same category.');
      }

      await Category.create({
        iconURL,
        name,
        code,
        subCategories: [],
      });

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully add category',
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const { code } = req.body;

      const category = await Category.findOne({ code });

      if (!category) {
        throw new NotFoundError('category not found!');
      }

      await category.deleteOne();

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully remove category',
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };

  subCategory = {
    add: async (req: Request, res: Response) => {
      try {
        const { cat, iconURL, name, code } = req.body;

        const category = await Category.findOne({ code: cat });

        if (!category) {
          throw new NotFoundError('category not found!');
        }

        if (category.subCategories.find((cat) => cat.code == code)) {
          throw new DuplicatedDataError('You cannot recreate it from the same sub category.');
        }

        category.subCategories.push({ iconURL, name, code, details: [] });

        await category.save();

        return response(res, {
          code: 200,
          success: true,
          message: 'Successfully add sub category',
        });
      } catch (error: any) {
        return exceptionResponse(res, error);
      }
    },
    remove: async (req: Request, res: Response) => {
      try {
        const { code, cat } = req.body;

        const category = await Category.findOne({ code: cat });

        if (!category) {
          throw new NotFoundError('category not found!');
        }

        if (!category.subCategories.find((cat) => cat.code == code)) {
          throw new NotFoundError('Sub category not found.');
        }

        category.subCategories = category.subCategories.filter((cat) => cat.code !== code);

        await category.save();

        return response(res, {
          code: 200,
          success: true,
          message: 'Successfully remove sub category',
        });
      } catch (error: any) {
        return exceptionResponse(res, error);
      }
    },
  };

  index = async (_: Request, res: Response) => {
    try {
      const categories = await Category.find();

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully get categories',
        data: categories,
      });
    } catch (error: any) {
      return exceptionResponse(res, error);
    }
  };
}
