import { NextFunction, Request, Response } from 'express';
import Hotel from '../models/Hotel';
import { response } from '../utils/response';
import IController from './ControllerInterface';

class HotelController implements IController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, min, max, ...others } = req.query;
      const hotels = await Hotel.find({
        ...others,
        cheapestPrice: {
          $gte: min || 1,
          $lte: max || 9999,
        },
      }).limit(limit as unknown as number);

      return response(res, 200, hotels, { message: 'success' });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const newHotel = new Hotel(req.body);
      const savedHotel = await newHotel.save();

      return response(res, 201, [savedHotel], {
        message: 'Hotel has been saved!',
      });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const hotel = await Hotel.findById(req.params.id);

      return response(res, 200, [hotel], { message: 'success' });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedHotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      if (!updatedHotel)
        return response(res, 404, [], {
          message: 'hotel not found',
        });

      return response(res, 201, [updatedHotel], {
        message: 'hotel has been updated',
      });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedHotel = await Hotel.findByIdAndDelete(
        req.params.id,
        req.body
      );

      if (!deletedHotel)
        return response(res, 404, [], {
          message: 'hotel not found',
        });

      return response(res, 201, [], {
        message: 'hotel has been deleted',
      });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }

  async countByCity(req: Request, res: Response, next: NextFunction) {
    const cities = (req.query.cities as string).split(',');
    try {
      const list = await Promise.all(
        cities.map((city) => {
          return Hotel.countDocuments({ city });
        })
      );

      return response(res, 200, list, {
        message: 'success',
      });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }

  async countByType(req: Request, res: Response, next: NextFunction) {
    try {
      const hotelCount = await Hotel.countDocuments({ type: 'hotel' });
      const apartmentCount = await Hotel.countDocuments({ type: 'apartment' });
      const resortCount = await Hotel.countDocuments({ type: 'resort' });
      const villaCount = await Hotel.countDocuments({ type: 'villa' });
      const cabinCount = await Hotel.countDocuments({ type: 'cabin' });

      return response(
        res,
        200,
        [
          { type: 'hotel', count: hotelCount },
          { type: 'apartment', count: apartmentCount },
          { type: 'resort', count: resortCount },
          { type: 'villa', count: villaCount },
          { type: 'cabin', count: cabinCount },
        ],
        {
          message: 'success',
        }
      );
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }
}

export default new HotelController();
