import { Request, Response, NextFunction } from 'express';
import TokenService from '@services/tokenService';
import { sendError } from '@libs/response';

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const access_token = req.headers['authorization']?.split(' ')[1]; 
    const refresh_token = req.body.refresh_token || req.headers['x-refresh-token']; 
   
    if (!access_token || !refresh_token) {
      return sendError(res, 401, 'Access token and refresh token are required');
    }

    const tokenData = await TokenService.checkToken(access_token, refresh_token);

    if (tokenData.accessToken) {
      res.setHeader('authorization', `Bearer ${tokenData.newAccessToken}`);
    }
    next();
  } catch (error) {
      console.error('Error in token check middleware:', error);
      return sendError(res, 500, 'Internal server error');
  }
};

export default checkToken;
