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

const importAdministrativeMaps = async () => {
  try {
    const rows: any = [];
    const result: any = await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath('administrative_maps'))
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('error', reject)
        .on('end', async () => {
          await queryInterface.bulkDelete('m_countries', null);
          await queryInterface.bulkDelete('m_wards', null);
          await queryInterface.bulkDelete('m_districts', null);
          await queryInterface.bulkDelete('m_provinces', null);
          const countryAttributes: any = [];
          const provinceAttributes: any = [];
          const districtAttributes: any = [];
          const wardAttributes: any = [];
          let countryIndex = 0;
          let provinceIndex = 0;
          let districtIndex = 0;
          let wardIndex = 0;
          rows.forEach((row: any) => {
            if (countryAttributes[countryAttributes.length - 1]?.code !== row.country_code) {
              countryIndex += 1;
              countryAttributes.push({
                id: countryIndex,
                code: row.country_code,
                title: row.country,
              });
            }
            if (provinceAttributes[provinceAttributes.length - 1]?.code !== row.province_code) {
              provinceIndex += 1;
              provinceAttributes.push({
                id: provinceIndex,
                country_id: countryIndex,
                code: row.province_code,
                title: row.province,
              });
            }
            if (districtAttributes[districtAttributes.length - 1]?.code !== row.district_code) {
              districtIndex += 1;
              districtAttributes.push({
                id: districtIndex,
                province_id: provinceIndex,
                code: row.district_code,
                title: row.district,
              });
            }
            if (wardAttributes[wardAttributes.length - 1]?.code !== row.ward_code) {
              wardIndex += 1;
              wardAttributes.push({
                id: wardIndex,
                district_id: districtIndex,
                code: row.ward_code,
                title: row.ward,
              });
            }
          });
          await queryInterface.bulkInsert('m_countries', countryAttributes);
          await queryInterface.bulkInsert('m_provinces', provinceAttributes);
          await queryInterface.bulkInsert('m_districts', districtAttributes);
          await queryInterface.bulkInsert('m_wards', wardAttributes);
          resolve(true);
        });
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export {
  importAdministrativeMaps,
};
