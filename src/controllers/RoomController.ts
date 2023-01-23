import { NextFunction, Request, Response } from 'express';
import Hotel from '../models/Hotel';
import Room from '../models/Room';
import { response } from '../utils/response';
import IController from './ControllerInterface';

class RoomController implements IController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const hotels = await Room.find();

      return response(res, 200, hotels, { message: 'success' });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    const hotelId = req.params.hotelid;
    const newRoom = new Room(req.body);
    try {
      const savedRoom = await newRoom.save();

      try {
        await Hotel.findByIdAndUpdate(hotelId, {
          $push: { rooms: savedRoom._id },
        });
      } catch (error: any) {
        return response(res, 500, [], { message: error.message });
      }

      return response(res, 201, [savedRoom], {
        message: 'Room has been saved!',
      });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await Room.findById(req.params.id);

      return response(res, 200, [room], { message: 'success' });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      if (!updatedRoom)
        return response(res, 404, [], {
          message: 'hotel not found',
        });

      return response(res, 201, [updatedRoom], {
        message: 'hotel has been updated',
      });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const hotelId = req.params.hotelid;
    try {
      await Room.findByIdAndDelete(req.params.id);

      try {
        await Hotel.findByIdAndUpdate(hotelId, {
          $pull: { rooms: req.params.id },
        });
      } catch (error: any) {
        return response(res, 500, [], { message: error.message });
      }

      return response(res, 201, [], {
        message: 'Room has been deleted!',
      });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }
}

export default new RoomController();
