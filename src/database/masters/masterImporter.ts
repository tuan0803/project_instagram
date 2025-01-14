import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Sequelize } from 'sequelize';

const env: any = process.env.NODE_ENV || 'development';
// eslint-disable-next-line node/no-path-concat
const config = require(`${__dirname}/../../configs/database`)[env];
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

const queryInterface = sequelize.getQueryInterface();

const csvFilePath = (tableName: string) => path.join(__dirname, `${tableName}.csv`);

const importMasterData = async (tableName: any) => {
  try {
    const recordsAttribute: any = [];
    const result: any = await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath(tableName))
        .pipe(csv())
        .on('data', (row) => recordsAttribute.push(row))
        .on('error', reject)
        .on('end', async () => {
          await queryInterface.bulkDelete(tableName, null);
          await queryInterface.bulkInsert(tableName, recordsAttribute);
          resolve(true);
        });
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export {
  importMasterData,
};
