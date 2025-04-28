import { WhereOptions } from 'sequelize';
import { DB_DATA_FUNCTIONS, opConditions } from '../../common/types/constants/UserConstant';
import { DataConditions, WhereField } from '../types/interfaces/CommonDbTypes';
import { getCustomLogger } from '../utils/Logger';

const logger = getCustomLogger('Common:Service:Db');

export const getSymbol = (condition: string) => {
  try {
    return opConditions[condition];
  } catch (error) {
    logger.error('Failed to fetch symbol for', condition, error.message || error);
    throw error;
  }
};

export const createWhereCondition = (condition: WhereField[]) => {
  try {
    let whereCondition: WhereOptions = {};
    condition.map(({ fieldName, whereCondition: dataCondition, conditionValue }) => {
      if (fieldName) {
        whereCondition = { ...whereCondition, [fieldName]: { [getSymbol(dataCondition)]: conditionValue } };
      } else {
        whereCondition = { ...whereCondition, [getSymbol(dataCondition)]: conditionValue };
      }
    });
    return whereCondition;
  } catch (error) {
    logger.error('Failed to create where condition for', condition, error.message || error);
    throw error;
  }
};

export const commonDbExecution = async (source: DataConditions) => {
  try {
    const {
      modelName,
      joinModels,
      requiredWhereFields,
      paginationData,
      functionType,
      addObject,
      updateObject,
      upsertObjects,
      updateColumns,
      requiredColumns,
      group,
      logging,
      raw,
    } = source;
    const whereCondition = requiredWhereFields ? createWhereCondition(requiredWhereFields) : null;
    const querySource: DataConditions = {
      ...(modelName && { modelName }),
      ...(joinModels && { joinModels }),
      ...(whereCondition && { whereCondition }),
      ...(paginationData && { paginationData }),
      ...(addObject && { addObject }),
      ...(updateObject && { updateObject }),
      ...(upsertObjects && { upsertObjects }),
      ...(updateColumns && { updateColumns }),
      ...(requiredColumns && { requiredColumns }),
      ...(group && { group }),
      ...(logging && { logging }),
      ...(raw && { raw }),
    };
    const queryFunction = DB_DATA_FUNCTIONS[functionType];
    const dbResponse = await queryFunction(querySource);
    return dbResponse;
  } catch (error) {
    logger.error(
      'Failed to execute db query for this source',
      {
        ...source,
        ...(source.requiredWhereFields && { requiredWhereFields: JSON.stringify(source.requiredWhereFields) }),
        ...(source.upsertObjects && { upsertObjects: JSON.stringify(source.upsertObjects).slice(0, 1000) }),
      },
      error.message || error,
    );
    throw error;
  }
};
