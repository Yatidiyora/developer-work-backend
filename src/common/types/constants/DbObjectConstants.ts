import { DB_DATA_FUNCTIONS_TYPES, SEQUELIZE_CONDITION_TYPES } from '../enums/CommonEnums';
import { DataConditions } from '../interfaces/CommonDbTypes';

const fetchDataFromTableObject: DataConditions = {
  modelName: '',
  functionType: DB_DATA_FUNCTIONS_TYPES.fetchDataFromTable,
  requiredWhereFields: [
    {
      whereCondition: SEQUELIZE_CONDITION_TYPES.and,
      conditionValue: null,
    },
  ],
};

const fetchAllDataFromTableObject: DataConditions = {
  modelName: '',
  functionType: DB_DATA_FUNCTIONS_TYPES.fetchDataFromTable,
};

const createDataObject: DataConditions = {
  modelName: '',
  functionType: DB_DATA_FUNCTIONS_TYPES.addDataInTable,
};

const paginationSourceObject: DataConditions = {
  modelName: '',
  functionType: DB_DATA_FUNCTIONS_TYPES.fetchDataFromTableWithPagination,
  requiredWhereFields: [
    {
      whereCondition: SEQUELIZE_CONDITION_TYPES.and,
      conditionValue: null,
    },
  ],
};

const fetchExistingDataFromTableObject: DataConditions = {
  modelName: '',
  functionType: DB_DATA_FUNCTIONS_TYPES.fetchExistingDataFromTable,
  requiredWhereFields: [
    {
      whereCondition: SEQUELIZE_CONDITION_TYPES.and,
      conditionValue: null,
    },
  ],
};

const updateDataInTableObject: DataConditions = {
  modelName: '',
  functionType: DB_DATA_FUNCTIONS_TYPES.updateDataInTable,
  requiredWhereFields: [
    {
      whereCondition: SEQUELIZE_CONDITION_TYPES.and,
      conditionValue: null,
    },
  ],
};

const deleteDataInTableObject: DataConditions = {
  modelName: '',
  functionType: DB_DATA_FUNCTIONS_TYPES.deleteDataInTable,
  requiredWhereFields: [
    {
      whereCondition: SEQUELIZE_CONDITION_TYPES.and,
      conditionValue: null,
    },
  ],
};

export {
  createDataObject,
  deleteDataInTableObject,
  fetchAllDataFromTableObject,
  fetchDataFromTableObject,
  fetchExistingDataFromTableObject,
  paginationSourceObject,
  updateDataInTableObject,
};
