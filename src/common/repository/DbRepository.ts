import { QueryTypes } from 'sequelize';
import { sequelize as pgSql } from '../../common/models/pg/index';
import {
  DataConditions,
  GetAllDataResponse,
  GetDataResponse,
  GetPaginationDataResponse,
  UpdateResponse,
} from '../types/interfaces/CommonDbTypes';
import { getCustomLogger } from '../utils/Logger';

const logger = getCustomLogger('common::Repository::Db');

export const fetchDataFromTable = async (source: DataConditions): Promise<GetAllDataResponse> => {
  try {
    const { modelName, whereCondition, requiredColumns, group, logging = false, raw = false } = source;

    const dataModel = pgSql.model(modelName);
    const dataObjects = await dataModel.findAll({
      ...(requiredColumns && { attributes: requiredColumns }),
      where: whereCondition,
      ...(group && { group }),
      ...(raw && { raw }),
      type: QueryTypes.SELECT,
      logging,
    });

    return { dataObjects };
  } catch (error) {
    logger.error('Failed to fetch data from db for this source', { source }, error.message || error.stack || error);
    throw error;
  }
};

export const fetchDataFromTableWithPagination = async (source: DataConditions): Promise<GetPaginationDataResponse> => {
  try {
    const {
      modelName,
      whereCondition,
      paginationData: { limit, offset, order },
      requiredColumns,
      logging = false,
    } = source;

    const dataModel = pgSql.model(modelName);
    const dataObjects = await dataModel.findAndCountAll({
      ...(requiredColumns && { attributes: requiredColumns }),
      where: whereCondition,
      raw: true,
      limit: limit,
      offset: offset,
      order: order,
      type: QueryTypes.SELECT,
      logging,
    });

    return { dataObjects };
  } catch (error) {
    logger.error('Failed to fetch data from db for this source', { source }, error.message || error.stack || error);
    throw error;
  }
};

export const fetchExistingDataFromTable = async (source: DataConditions): Promise<GetDataResponse> => {
  try {
    const { modelName, whereCondition, requiredColumns, logging = false, raw = false } = source;

    const dataModel = pgSql.model(modelName);
    const dataObject = await dataModel.findOne({
      ...(requiredColumns && { attributes: requiredColumns }),
      where: whereCondition,
      ...(raw && { raw }),
      type: QueryTypes.SELECT,
      logging,
    });

    return { dataObject };
  } catch (error) {
    logger.error(
      'Failed to fetch single data from db for this source',
      { source },
      error.message || error.stack || error,
    );
    throw error;
  }
};

export const updateDataInTable = async (source: DataConditions): Promise<UpdateResponse> => {
  try {
    const { modelName, whereCondition, updateObject, logging = false } = source;

    const dataModel = pgSql.model(modelName);
    const updateData = await dataModel.update(updateObject, {
      where: whereCondition,
      logging,
    });

    return { updateData };
  } catch (error) {
    logger.error('Failed to update data in db for this source', { source }, error.message || error.stack || error);
    throw error;
  }
};

export const addDataInTable = async (source: DataConditions) => {
  try {
    const { modelName, addObject, logging = false } = source;

    const dataModel = pgSql.model(modelName);
    await dataModel.create(addObject, {
      logging,
    });
  } catch (error) {
    logger.error(
      'Failed to create new record in db for this source',
      { source },
      error.message || error.stack || error,
    );
    throw error;
  }
};

export const bulkUpsertDataInTable = async (source: DataConditions) => {
  try {
    const { modelName, upsertObjects, updateColumns, logging = false } = source;

    const dataModel = pgSql.model(modelName);
    await dataModel.bulkCreate(upsertObjects, {
      updateOnDuplicate: updateColumns,
      logging,
    });
  } catch (error) {
    logger.error(
      'Failed to bulk upsert data in db for this source',
      {
        ...source,
        ...(source.upsertObjects && { upsertObjects: JSON.stringify(source.upsertObjects).slice(0, 1000) }),
      },
      error.message || error.stack || error,
    );
    throw error;
  }
};

export const bulkCreateDataInTable = async (source: DataConditions) => {
  try {
    const { modelName, upsertObjects, ignoreDuplicates, logging = false } = source;

    const dataModel = pgSql.model(modelName);
    await dataModel.bulkCreate(upsertObjects, {
      ...(ignoreDuplicates && { ignoreDuplicates }),
      logging,
    });
  } catch (error) {
    logger.error(
      'Failed to bulk create data in db for this source',
      {
        ...source,
        ...(source.upsertObjects && { upsertObjects: JSON.stringify(source.upsertObjects).slice(0, 1000) }),
      },
      error.message || error.stack || error,
    );
    throw error;
  }
};

export const deleteDataInTable = async (source: DataConditions) => {
  try {
    const { modelName, whereCondition, logging = false } = source;

    const dataModel = pgSql.model(modelName);
    await dataModel.destroy({
      where: whereCondition,
      logging,
    });
  } catch (error) {
    logger.error('Failed to delete data from db for this source', { source }, error.message || error.stack || error);
    throw error;
  }
};
