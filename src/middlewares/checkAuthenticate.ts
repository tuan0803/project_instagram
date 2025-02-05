import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '@models/users';
import { sendError } from '@libs/response';
import Settings from '@configs/settings';
import { BadAuthentication, NoData, Forbidden } from '@libs/errors';

const ACCESS_SECRET = Settings.jwtSecret;

export const checkAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];

        if (!accessToken) {
            return sendError(res, 401, BadAuthentication);
        }

        try {
            const decoded = jwt.verify(accessToken, ACCESS_SECRET) as { userId: number };

            const user = await UserModel.findOne({ where: { id: decoded.userId } });
            if (!user) {
                return sendError(res, 404, NoData);
            }
            req.currentUser = user; 
            return next();
        } catch (error) {
            return sendError(res, 401, BadAuthentication);
        }
    } catch (error) {
        return sendError(res, 500, 'Internal Server Error');
    }
};
