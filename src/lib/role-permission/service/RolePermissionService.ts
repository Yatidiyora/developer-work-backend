import { Request, Response } from 'express';
import { UserRoleMappingModel } from '../../../common/models/pg';
import { commonDbExecution } from '../../../common/service/DbService';
import {
  fetchAllDataFromTableObject,
  fetchDataFromTableObject,
} from '../../../common/types/constants/DbObjectConstants';
import { DB_MODELS, STATUS_CODE, STATUS_MESSAGE } from '../../../common/types/enums/CommonEnums';
import { DataConditions, GetAllDataResponse } from '../../../common/types/interfaces/CommonDbTypes';
import { RequestUser } from '../../../common/types/interfaces/UserInterface';
import { getCustomLogger } from '../../../common/utils/Logger';

const logger = getCustomLogger('RolePermission::RolePermissionService');

export const fetchPermissionsFromUserId = async (req: Request, res: Response) => {
  const { id } = req.user as RequestUser;
  try {
    const rolesSource: DataConditions = fetchDataFromTableObject;
    rolesSource.modelName = DB_MODELS.UserRoleMappingModel;
    rolesSource.requiredWhereFields[0].conditionValue = {
      userId: id,
    };
    const { dataObjects } = (await commonDbExecution(rolesSource)) as GetAllDataResponse;
    const roles = dataObjects as UserRoleMappingModel[];
    const roleIds: string[] = roles.map((role) => role.roleId);
    rolesSource.modelName = DB_MODELS.RolePermissionDetailsModel;
    rolesSource.requiredWhereFields[0].conditionValue = {
      roleId: roleIds,
    };
    const { dataObjects: permissions } = (await commonDbExecution(rolesSource)) as GetAllDataResponse;
    logger.info('Role permissions fetched successfully!');
    res.status(STATUS_CODE.SUCCESS).json({ result: permissions, status: STATUS_CODE.SUCCESS });
  } catch (error) {
    logger.error('Error while fetching the permissions', error.message || error.stack || error);
    res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: STATUS_MESSAGE.PERMISSIONS_NOT_FOUND, status: STATUS_MESSAGE.ERROR });
  }
};
export const fetchAllRolesPermissions = async (req: Request, res: Response) => {
  try {
    fetchAllDataFromTableObject.modelName = DB_MODELS.PermissionDetailsModel;
    const { dataObjects: allPermissions } = (await commonDbExecution(
      fetchAllDataFromTableObject,
    )) as GetAllDataResponse;
    logger.info('Roles All Permissions fetched successfully!');
    res.status(STATUS_CODE.SUCCESS).json({ result: allPermissions, status: STATUS_CODE.SUCCESS });
  } catch (error) {
    logger.error('Error while fetching all the available permissions', error.message || error.stack || error);
    res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: STATUS_MESSAGE.PERMISSIONS_NOT_FOUND, status: STATUS_MESSAGE.ERROR });
  }
};
