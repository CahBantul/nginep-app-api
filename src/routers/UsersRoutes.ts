import UserController from '../controllers/UserController';
import { verifyAdmin, verifyUser } from '../utils/verify';
import BaseRoutes from './BaseRouter';

// Controllers

class UserRoutes extends BaseRoutes {
  public routes(): void {
    this.router.get('/', verifyAdmin, UserController.index);
    this.router.post('/', UserController.store);
    this.router.get('/:id', verifyUser, UserController.show);
    this.router.put('/:id', verifyUser, UserController.update);
    this.router.delete('/:id', verifyUser, UserController.delete);
  }
}

export default new UserRoutes().router;
