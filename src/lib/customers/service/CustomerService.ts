import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { commonDbExecution } from '../../../common/service/DbService';
import {
  fetchExistingDataFromTableObject,
  paginationSourceObject,
} from '../../../common/types/constants/DbObjectConstants';
import { COMMON_COLUMNS, DB_MODELS, SORT, STATUS_CODE, STATUS_MESSAGE } from '../../../common/types/enums/CommonEnums';
import {
  DataConditions,
  GetDataResponse,
  GetPaginationDataResponse,
} from '../../../common/types/interfaces/CommonDbTypes';
import { RequestQuery } from '../../../common/types/interfaces/UserInterface';
import { getCustomLogger } from '../../../common/utils/Logger';

const logger = getCustomLogger('Customer::CustomerService');

export const fetchAllCustomers = async (req: Request, res: Response) => {
  const {
    size,
    offset,
    keyword,
    sortColumnName = COMMON_COLUMNS.UPDATED_AT,
    sortOrder = SORT.DESC,
  } = req.query as Partial<RequestQuery>;
  try {
    const paginationSource: DataConditions = paginationSourceObject;
    paginationSource.modelName = DB_MODELS.CustomerDetailsModel;
    paginationSource.requiredWhereFields[0].conditionValue = {
      [Op.or]: ['customerName', 'email'].map((field) => ({
        [field]: { [Op.like]: `%${keyword ?? ''}%` },
      })),
    };
    paginationSource.paginationData = {
      limit: Number(size) ?? 10,
      offset: Number(offset) ?? 0,
      order: [[sortColumnName, sortOrder]],
    };
    const {
      dataObjects: { rows, count },
    } = (await commonDbExecution(paginationSource)) as GetPaginationDataResponse;
    res.status(STATUS_CODE.SUCCESS).json({ result: rows, total: count, status: STATUS_MESSAGE.SUCCESS });
  } catch (error) {
    logger.error('Error while fetching users ', error);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: STATUS_MESSAGE.USER_NOT_FETCHED, status: STATUS_MESSAGE.ERROR });
  }
};

export const fetchCustomerDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const customerSource: DataConditions = fetchExistingDataFromTableObject;
    customerSource.modelName = DB_MODELS.CustomerDetailsModel;
    customerSource.requiredWhereFields[0].conditionValue = { id };
    customerSource.raw = true;
    const { dataObject } = (await commonDbExecution(customerSource)) as GetDataResponse;
    res.status(STATUS_CODE.SUCCESS).json(dataObject);
  } catch (error) {
    logger.error('Error while fetching users ', error);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: STATUS_MESSAGE.USER_NOT_FETCHED, status: STATUS_MESSAGE.ERROR });
  }
};
