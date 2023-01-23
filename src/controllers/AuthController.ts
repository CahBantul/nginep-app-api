import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { response } from '../utils/response';
import jwt from 'jsonwebtoken';

require('dotenv').config();

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password } = req.body;
      const hash = bcrypt.hashSync(password, 10);

      const newUser = new User({
        username,
        email,
        password: hash,
      });
      await newUser.save();

      return response(res, 201, [], {
        message: 'User has been created!',
      });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findOne({ username: req.body.username });

      if (!user)
        return response(res, 404, [], {
          message: 'invalid username or password',
        });

      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!isPasswordCorrect)
        return response(res, 404, [], {
          message: 'invalid username or password',
        });

      const token = jwt.sign(
        { _id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      const { isAdmin, password, ...others } = user._doc;

      return res
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .status(200)
        .json({ ...others });
    } catch (error: any) {
      return response(res, 500, [], { message: error.message });
    }
  }
}

export default new AuthController();
