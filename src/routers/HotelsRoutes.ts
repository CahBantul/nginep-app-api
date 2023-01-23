import HotelController from '../controllers/HotelController';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verify';
import BaseRoutes from './BaseRouter';

// Controllers

class HotelRoutes extends BaseRoutes {
  public routes(): void {
    this.router.get('/countbycity', HotelController.countByCity);
    this.router.get('/countbytype', HotelController.countByType);
    this.router.get('/', HotelController.index);
    this.router.post('/', verifyAdmin, HotelController.store);
    this.router.get('/:id', HotelController.show);
    this.router.put('/:id', verifyAdmin, HotelController.update);
    this.router.delete('/:id', verifyAdmin, HotelController.delete);
  }
}

export default new HotelRoutes().router;
