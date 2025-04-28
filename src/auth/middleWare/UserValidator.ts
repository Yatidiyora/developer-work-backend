import { DataConditions, GetDataResponse } from 'interfaces/CommonDbTypes';
import { DB_MODELS, STATUS_CODE } from '../../common/types/enums/CommonEnums';
import { Request } from 'express';
import { fetchExistingDataFromTableObject } from '../../common/types/constants/DbObjectConstants';
import { commonDbExecution } from '../../common/service/DbService';
import { UserDetailsModel } from '../../common/models/pg';

export const validateUser = async (req: Request) => {
  const { id } = req.body;
  const userSource: DataConditions = fetchExistingDataFromTableObject;
    userSource.modelName = DB_MODELS.UserDetailsModel;
    userSource.requiredWhereFields[0].conditionValue = {id};
    userSource.requiredColumns = { exclude: ['password'] };
    const { dataObject: user} = await commonDbExecution(userSource) as GetDataResponse;
  if (!user) {
    return STATUS_CODE.NOT_FOUND;
  }
  return user as UserDetailsModel;
};
