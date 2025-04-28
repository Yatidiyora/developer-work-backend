import { Request, Response } from 'express';
import { commonDbExecution } from '../../../common/service/DbService';
import { fetchDataFromTableObject } from '../../../common/types/constants/DbObjectConstants';
import { DB_MODELS, STATUS_CODE, STATUS_MESSAGE } from '../../../common/types/enums/CommonEnums';
import { DataConditions, GetAllDataResponse } from '../../../common/types/interfaces/CommonDbTypes';
import { RequestUser } from '../../../common/types/interfaces/UserInterface';
import { getCustomLogger } from '../../../common/utils/Logger';

const logger = getCustomLogger('UserRole::UserRoleService');

interface AuthenticatedRequest extends Request {
  user: { id: string }; // Define 'user' with an 'id' property
}

export const fetchRolesByUserId = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.user as RequestUser;
  try {
    const rolesSource: DataConditions = fetchDataFromTableObject;
    rolesSource.modelName = DB_MODELS.RolePermissionDetailsModel;
    rolesSource.requiredWhereFields[0].conditionValue = {
      userId: id,
    };
    const { dataObjects } = (await commonDbExecution(rolesSource)) as GetAllDataResponse;
    res.status(STATUS_CODE.SUCCESS).json({ result: dataObjects, status: STATUS_CODE.SUCCESS });
  } catch (error) {
    logger.error('Failed to get roles by user id', error.message || error.stack || error);
    res.status(STATUS_CODE.NOT_FOUND).json({ message: STATUS_MESSAGE.ROLE_NOT_FOUND, status: STATUS_MESSAGE.ERROR });
  }
};
