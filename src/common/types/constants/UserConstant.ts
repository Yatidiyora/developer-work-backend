import { Op } from 'sequelize';
import {
  addDataInTable,
  bulkCreateDataInTable,
  bulkUpsertDataInTable,
  deleteDataInTable,
  fetchDataFromTable,
  fetchDataFromTableWithPagination,
  fetchExistingDataFromTable,
  updateDataInTable,
} from '../../../common/repository/DbRepository';

export const opConditions: { [key: string]: symbol } = {
  lte: Op.lte,
  and: Op.and,
  gte: Op.gte,
  lt: Op.lt,
  gt: Op.gt,
  eq: Op.eq,
  iLike: Op.iLike,
  in: Op.in,
  like: Op.like,
  ne: Op.ne,
  not: Op.not,
  notIn: Op.notIn,
  notLike: Op.notLike,
  startsWith: Op.startsWith,
  contains: Op.contains,
  endsWith: Op.endsWith,
  is: Op.is,
  iRegexp: Op.iRegexp,
  noExtendLeft: Op.noExtendLeft,
  noExtendRight: Op.noExtendRight,
  between: Op.between,
};

export const DB_DATA_FUNCTIONS = {
  fetchDataFromTable: fetchDataFromTable,
  fetchDataFromTableWithPagination: fetchDataFromTableWithPagination,
  fetchExistingDataFromTable: fetchExistingDataFromTable,
  updateDataInTable: updateDataInTable,
  addDataInTable: addDataInTable,
  bulkUpsertDataInTable: bulkUpsertDataInTable,
  bulkCreateDataInTable: bulkCreateDataInTable,
  deleteDataInTable: deleteDataInTable,
};
