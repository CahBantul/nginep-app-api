import AuthController from '../controllers/AuthController';
import BaseRoutes from './BaseRouter';

// Controllers

class AuthRoutes extends BaseRoutes {
  public routes(): void {
    this.router.post('/register', AuthController.register);
    this.router.post('/login', AuthController.login);
  }
}

export default new AuthRoutes().router;
