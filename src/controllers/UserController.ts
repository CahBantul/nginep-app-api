import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import { response } from '../utils/response';
import IController from './ControllerInterface';
import bcrypt from 'bcrypt';

class UserController implements IController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find();

      return response(res, 200, users, { message: 'success' });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password } = req.body;
      const hash = bcrypt.hashSync(password, 10);

      const newUser = new User({
        username,
        email,
        password: hash,
      });
      await newUser.save();

      return response(res, 201, [newUser], {
        message: 'User has been saved!',
      });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.params.id);

      return response(res, 200, [user], { message: 'success' });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { username: req.body.username, email: req.body.email, password: hash },
        {
          new: true,
        }
      );

      if (!updatedUser)
        return response(res, 404, [], {
          message: 'user not found',
        });

      const { password, isAdmin, ...rest } = updatedUser._doc;

      return response(res, 201, [{ ...rest }], {
        message: 'user has been updated',
      });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id, req.body);

      if (!deletedUser)
        return response(res, 404, [], {
          message: 'user not found',
        });

      return response(res, 201, [], {
        message: 'user has been deleted',
      });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }
}

export default new UserController();
