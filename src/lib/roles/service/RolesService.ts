import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { RoleDetailsModel, RolePermissionDetailsModel } from '../../../common/models/pg';
import { commonDbExecution } from '../../../common/service/DbService';
import {
  deleteDataInTableObject,
  fetchDataFromTableObject,
  fetchExistingDataFromTableObject,
  paginationSourceObject,
  updateDataInTableObject,
} from '../../../common/types/constants/DbObjectConstants';
import { UPDATE_COLUMNS } from '../../../common/types/constants/UpsertConstants';
import {
  COMMON_COLUMNS,
  DB_DATA_FUNCTIONS_TYPES,
  DB_MODELS,
  ERROR,
  SORT,
  STATUS_CODE,
  STATUS_MESSAGE,
} from '../../../common/types/enums/CommonEnums';
import {
  DataConditions,
  GetAllDataResponse,
  GetDataResponse,
  GetPaginationDataResponse,
} from '../../../common/types/interfaces/CommonDbTypes';
import { RolePermission, RolePermissionsById } from '../../../common/types/interfaces/RolePermission';
import { RequestQuery } from '../../../common/types/interfaces/UserInterface';
import { getCustomLogger } from '../../../common/utils/Logger';

const logger = getCustomLogger('Role::RolesService');

export const fetchAllRoles = async (req: Request, res: Response) => {
  const {
    size,
    offset,
    sortColumnName = COMMON_COLUMNS.UPDATED_AT,
    sortOrder = SORT.DESC,
    keyword,
  } = req.query as Partial<RequestQuery>;
  try {
    const paginationSource: DataConditions = paginationSourceObject;
    paginationSource.modelName = DB_MODELS.RoleDetailsModel;
    paginationSource.requiredWhereFields[0].conditionValue = {
      name: { [Op.like]: `${keyword ?? ''}%` },
    };
    paginationSource.paginationData = {
      limit: Number(size) ?? 10,
      offset: Number(offset) ?? 0,
      order: [[sortColumnName, sortOrder]],
    };
    const {
      dataObjects: { count, rows },
    } = (await commonDbExecution(paginationSource)) as GetPaginationDataResponse;
    res.status(STATUS_CODE.SUCCESS).json({ result: rows, total: count, status: STATUS_MESSAGE.SUCCESS });
  } catch (error) {
    logger.error('Error while fetching roles ', error);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: STATUS_MESSAGE.ROLE_NOT_FETCHED, status: STATUS_MESSAGE.ERROR });
  }
};

export const fetchRoleByRoleName = async (req: Request, res: Response) => {
  const { keyword, size, offset } = req.query;
  try {
    const paginationSource: DataConditions = paginationSourceObject;
    paginationSource.modelName = DB_MODELS.RoleDetailsModel;
    paginationSource.requiredWhereFields[0].conditionValue = {
      name: { [Op.like]: `${keyword ?? ''}%` },
    };
    paginationSource.paginationData = {
      limit: Number(size) ?? 10,
      offset: Number(offset) ?? 0,
    };
    const {
      dataObjects: { count, rows },
    } = (await commonDbExecution(paginationSource)) as GetPaginationDataResponse;
    res.status(STATUS_CODE.SUCCESS).json({ result: rows, total: count, status: STATUS_MESSAGE.SUCCESS });
  } catch (error) {
    logger.error('Error while fetching role by primary key ', error);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: STATUS_MESSAGE.ROLE_NOT_FETCHED, status: STATUS_MESSAGE.ERROR });
  }
};

export const fetchRoleByRoleId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const roleSource: DataConditions = fetchExistingDataFromTableObject;
    roleSource.modelName = DB_MODELS.RoleDetailsModel;
    roleSource.requiredWhereFields[0].conditionValue = { id };
    const { dataObject: fetchedRoleByPrimaryKey } = (await commonDbExecution(roleSource)) as GetDataResponse;
    if (!fetchedRoleByPrimaryKey) {
      res.status(STATUS_CODE.NOT_FOUND).json({ message: STATUS_MESSAGE.ROLE_NOT_FOUND, status: STATUS_MESSAGE.ERROR });
      return;
    }
    const assignedRoleSource: DataConditions = fetchDataFromTableObject;
    assignedRoleSource.modelName = DB_MODELS.RolePermissionDetailsModel;
    assignedRoleSource.requiredWhereFields[0].conditionValue = {
      roleId: {
        [Op.in]: [id],
      },
    };
    const { dataObjects: roleAssignedPermissions } = (await commonDbExecution(
      assignedRoleSource,
    )) as GetAllDataResponse;
    const { id: roleId, name, createdAt, updatedAt } = fetchedRoleByPrimaryKey as RoleDetailsModel;
    const rolePermissionByRoleIdResponse: RolePermissionsById = {
      id: roleId,
      name: name,
      permissions: (roleAssignedPermissions as RolePermissionDetailsModel[]) ?? [],
      createdAt: createdAt,
      updatedAt: updatedAt,
    };
    res.status(STATUS_CODE.SUCCESS).json({ result: rolePermissionByRoleIdResponse, status: STATUS_MESSAGE.SUCCESS });
  } catch (error) {
    logger.error('Error while fetching role by primary key ', error);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: STATUS_MESSAGE.ROLE_NOT_FETCHED, status: STATUS_MESSAGE.ERROR });
  }
};

export const addRoleToDb = async (req: Request, res: Response) => {
  const { name, permissions } = req.body;
  try {
    if (!name) {
      res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: STATUS_MESSAGE.ROLE_NAME_NOT_PRESENT, status: STATUS_MESSAGE.ERROR });
    }
    const rolePermissionId = uuidv4();
    const roleSource: DataConditions = {
      modelName: DB_MODELS.RoleDetailsModel,
      addObject: {
        id: rolePermissionId,
        name: name,
        description: name,
      },
      functionType: DB_DATA_FUNCTIONS_TYPES.addDataInTable,
    };
    await commonDbExecution(roleSource);
    const newRolePermissions = (permissions as RolePermission[]).map(
      ({ permissionId, permissionName, view, edit, delete: isDelete }) => ({
        roleId: rolePermissionId,
        permissionId: permissionId,
        permissionName: permissionName,
        view: view,
        edit: edit,
        delete: isDelete,
      }),
    );
    const permissionSource: DataConditions = {
      modelName: DB_MODELS.RolePermissionDetailsModel,
      functionType: DB_DATA_FUNCTIONS_TYPES.bulkCreateDataInTable,
      updateColumns: UPDATE_COLUMNS.ROLE_PERMISSIONS,
      upsertObjects: newRolePermissions,
      ignoreDuplicates: true,
    };
    await commonDbExecution(permissionSource);
    res.status(STATUS_CODE.SUCCESS).json({ message: STATUS_MESSAGE.ROLE_CREATED, status: STATUS_MESSAGE.SUCCESS });
  } catch (error) {
    if (error.name === ERROR.SEQUELIZE_UNIQUE_CONSTRAINT) {
      logger.error('Role is already present ', error);
      res
        .status(STATUS_CODE.DATA_ALREADY_PRESENT)
        .json({ message: STATUS_MESSAGE.ROLE_IS_ALREADY_PRESENT, status: STATUS_MESSAGE.ERROR });
      return;
    }
    logger.error('Error while creating role ', error);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: STATUS_MESSAGE.ROLE_NOT_CREATED, status: STATUS_MESSAGE.ERROR });
  }
};

export const deleteRoleFromDb = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleteRoleSource: DataConditions = deleteDataInTableObject;
    deleteRoleSource.modelName = DB_MODELS.RoleDetailsModel;
    deleteRoleSource.requiredWhereFields[0].conditionValue = { id };
    await commonDbExecution(deleteRoleSource);
    deleteRoleSource.modelName = DB_MODELS.RolePermissionDetailsModel;
    deleteRoleSource.requiredWhereFields[0].conditionValue = { roleId: id };
    await commonDbExecution(deleteRoleSource);
    res.status(STATUS_CODE.SUCCESS).json({ message: STATUS_MESSAGE.ROLE_DELETED, status: STATUS_MESSAGE.SUCCESS });
  } catch (error) {
    if (error.name === ERROR.SEQUELIZE_VALIDATION) {
      logger.error('Role not found ', error);
      res.status(STATUS_CODE.NOT_FOUND).json({ message: STATUS_MESSAGE.ROLE_NOT_FOUND, status: STATUS_MESSAGE.ERROR });
    }
    logger.error('Error while deleting role ', error);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: STATUS_MESSAGE.ROLE_NOT_DELETED, status: STATUS_MESSAGE.ERROR });
  }
};

export const updateRoleToDb = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, permissions } = req.body;
  try {
    const roleSource: DataConditions = updateDataInTableObject;
    roleSource.modelName = DB_MODELS.RoleDetailsModel;
    roleSource.requiredWhereFields[0].conditionValue = { id };
    roleSource.updateObject = {name};
    await commonDbExecution(roleSource);
    const updatedRolePermissions = (permissions as RolePermission[]).map(
      ({ permissionId, roleId, permissionName, view, edit, delete: isDelete }) => ({
        roleId,
        permissionId,
        permissionName,
        view,
        edit,
        delete: isDelete,
      }),
    );
    const permissionSource: DataConditions = {
      modelName: DB_MODELS.RolePermissionDetailsModel,
      functionType: DB_DATA_FUNCTIONS_TYPES.bulkUpsertDataInTable,
      upsertObjects: updatedRolePermissions,
      updateColumns: UPDATE_COLUMNS.ROLE_PERMISSIONS,
    };
    await commonDbExecution(permissionSource);
    res.status(STATUS_CODE.SUCCESS).json({ message: STATUS_MESSAGE.ROLE_UPDATED, status: STATUS_MESSAGE.SUCCESS });
  } catch (error) {
    logger.error('Error while deleting user ', error);
    res.status(STATUS_CODE.SUCCESS).json({ message: STATUS_MESSAGE.ROLE_NOT_UPDATED, status: STATUS_MESSAGE.ERROR });
  }
};
