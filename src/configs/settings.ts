import dotenv from 'dotenv';

dotenv.config();

export default {
  defaultPerPage: '12',
  jwtSecret: process.env.JWT_SECRET || 'H6O6ddY0Gpw61CS0YRiNob8pq23vCr2S',
};