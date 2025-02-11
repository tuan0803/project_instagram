import dotenv from 'dotenv';

dotenv.config();

export default {
  defaultPerPage: '12',
  jwtSecret: process.env.JWT_SECRET || 'H6O6ddY0Gpw61CS0YRiNob8pq23vCr2S',
  jwtRefreshSecret: '123',
  access_ttl: process.env.ACCESS_TTL || '1h',
  refresh_ttl: process.env.REFRESH_TTL || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000/no/api/v1',
};
