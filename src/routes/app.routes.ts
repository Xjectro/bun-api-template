import { Router } from 'express';
import { auth, verifyRole } from '../middlewares/authenticate';
import validateBody, { appSchema } from '../api/transport/validator';
import AppCategoriesController from '../controllers/app/categories/index.ctrl';

class AppRoutes {
  public router = Router();
  private controller = {
    categories: new AppCategoriesController(),
  };
  private schema = appSchema;

  constructor() {
    /**
     * Categories Routes
     */
    this.router.get('/categories', this.controller.categories.index);
    this.router.post(
      '/categories/add',
      validateBody(this.schema.categories.addSchema),
      auth,
      verifyRole(['ADMIN']),
      this.controller.categories.add,
    );
    this.router.post(
      '/categories/remove',
      validateBody(this.schema.categories.removeSchema),
      auth,
      verifyRole(['ADMIN']),
      this.controller.categories.remove,
    );

    /**
     * Sub Category Routes
     */
    this.router.post(
      '/categories/sub-category/add',
      validateBody(this.schema.categories.subCategory.addSchema),
      auth,
      verifyRole(['ADMIN']),
      this.controller.categories.subCategory.add,
    );
    this.router.post(
      '/categories/sub-category/remove',
      validateBody(this.schema.categories.subCategory.removeSchema),
      auth,
      verifyRole(['ADMIN']),
      this.controller.categories.subCategory.remove,
    );
  }
}

export default new AppRoutes().router;
