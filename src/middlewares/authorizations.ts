import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Settings from '@configs/settings';

function verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, Settings.jwtSecret, (err: any, user: any) => {
            if (err) {
                reject(err);  
            } else {
                resolve(user);  
            }
        });
    });
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1]; 
    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }
    
    try {
        const user = await verifyToken(token); 
        req.user = user;  
        next();
    } catch (err) {
        console.error('Token verification error:', err);  
        return res.status(403).json({ message: 'Invalid token' }); 
    }
};

