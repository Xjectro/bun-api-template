import { type Application } from 'express';

import UsersRoutes from './users.routes';
import AuthRoutes from './auth.routes';
import TokenRoutes from './token.routes';
import CdnRoutes from './cdn.routes';
import AppRoutes from './app.routes';

export default class Routes {
  constructor(app: Application) {
    app.use('/api/users', UsersRoutes);
    app.use('/api/auth', AuthRoutes);
    app.use('/api/token', TokenRoutes);
    app.use('/api/cdn', CdnRoutes);
    app.use('/api/app', AppRoutes);
  }
}
