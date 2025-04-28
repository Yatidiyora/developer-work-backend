import { Sequelize } from 'sequelize';
import getConfig from '../../config/config';
import { ConfigurationDetailsModel, initConfigurationDetailsModel } from './ConfigurationDetailsModel';
import { initPermissionDetailsModel, PermissionDetailsModel } from './PermissionsDetailsModel';
import { initRoleDetailsModel, RoleDetailsModel } from './RoleDetailsModel';
import { initRolePermissionDetailsModel, RolePermissionDetailsModel } from './RolePermissionDetailsModel';
import { initUserDetailsModel, UserDetailsModel } from './UserDetailsModel';
import { initUserRoleMappingModel, UserRoleMappingModel } from './UserRoleMappingModel';
import { initCustomerDetailsModel, CustomerDetailsModel } from './CustomerDetailsModel';
import { initCustomerOrdersDetailsModel, CustomerOrdersDetailsModel } from './CustomerOrdersDetailsModel';
import { initOrderCategoryModel, OrderCategoryModel } from './OrderCategoryModel';

let sequelize: Sequelize;
const initPgDB = () => {
  const {
    PG_DB: { DATABASE, PORT, USERNAME, PASSWORD, HOST },
  } = getConfig();

  sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
    schema: 'public',
    host: HOST,
    port: PORT,
    logging: false,
    dialect: 'postgres',
    dialectOptions: {
      maxPreparedStatements: 300,
    },
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  });

  initConfigurationDetailsModel(sequelize);
  initUserDetailsModel(sequelize);
  initRolePermissionDetailsModel(sequelize);
  initRoleDetailsModel(sequelize);
  initPermissionDetailsModel(sequelize);
  initUserRoleMappingModel(sequelize);
  initCustomerDetailsModel(sequelize);
  initCustomerOrdersDetailsModel(sequelize);
  initOrderCategoryModel(sequelize);
};

export {
  ConfigurationDetailsModel,
  initPgDB as initAuroraDB,
  PermissionDetailsModel,
  RoleDetailsModel,
  RolePermissionDetailsModel,
  sequelize,
  UserDetailsModel,
  UserRoleMappingModel,
  CustomerDetailsModel,
  CustomerOrdersDetailsModel,
  OrderCategoryModel,
};
