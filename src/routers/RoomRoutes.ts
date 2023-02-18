import RoomController from '../controllers/RoomController';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verify';
import BaseRoutes from './BaseRouter';

// Controllers

class RoomRoutes extends BaseRoutes {
  public routes(): void {
    this.router.get('/', RoomController.index);
    this.router.post('/:hotelid', verifyAdmin, RoomController.store);
    this.router.get('/:id', RoomController.show);
    this.router.put('/:id', verifyAdmin, RoomController.update);
    this.router.put('/availability/:id', RoomController.updateRoomAvaibility);
    this.router.delete('/:hotelid/:id', verifyAdmin, RoomController.delete);
  }
}

export default new RoomRoutes().router;
