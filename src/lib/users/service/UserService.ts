import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { RoleDetailsModel, UserRoleMappingModel } from '../../../common/models/pg';
import { commonDbExecution } from '../../../common/service/DbService';
import {
  createDataObject,
  deleteDataInTableObject,
  fetchDataFromTableObject,
  fetchExistingDataFromTableObject,
  paginationSourceObject,
  updateDataInTableObject,
} from '../../../common/types/constants/DbObjectConstants';
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
import { RequestQuery, UserObject } from '../../../common/types/interfaces/UserInterface';
import { getCustomLogger } from '../../../common/utils/Logger';

const logger = getCustomLogger('User::UserService');

export const fetchAllUsers = async (req: Request, res: Response) => {
  const {
    size,
    offset,
    keyword,
    sortColumnName = COMMON_COLUMNS.UPDATED_AT,
    sortOrder = SORT.DESC,
  } = req.query as Partial<RequestQuery>;
  try {
    const paginationSource: DataConditions = paginationSourceObject;
    paginationSource.modelName = DB_MODELS.UserDetailsModel;
    paginationSource.requiredWhereFields[0].conditionValue = {
      [Op.or]: ['userName', 'firstName', 'lastName', 'email'].map((field) => ({
        [field]: { [Op.like]: `%${keyword ?? ''}%` },
      })),
      isActive: 1,
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

export const fetchUserByUserName = async (req: Request, res: Response) => {
  const {
    keyword,
    size,
    offset,
    sortColumnName = COMMON_COLUMNS.UPDATED_AT,
    sortOrder = SORT.DESC,
  } = req.query as Partial<RequestQuery>;
  try {
    const paginationSource: DataConditions = paginationSourceObject;
    paginationSource.modelName = DB_MODELS.UserDetailsModel;
    paginationSource.requiredWhereFields[0].conditionValue = {
      [Op.or]: ['userName', 'firstName', 'lastName', 'email'].map((field) => ({
        [field]: { [Op.like]: `%${keyword ?? ''}%` },
      })),
      isActive: 1,
    };
    paginationSource.paginationData = {
      limit: Number(size) ?? 10,
      offset: Number(offset) ?? 0,
      order: [[sortColumnName, sortOrder]],
    };
    paginationSource.requiredColumns = { exclude: ['password'] };
    const {
      dataObjects: { rows, count },
    } = (await commonDbExecution(paginationSource)) as GetPaginationDataResponse;
    res.status(STATUS_CODE.SUCCESS).json({ result: rows, total: count, status: STATUS_MESSAGE.SUCCESS });
  } catch (error) {
    logger.error('Error while fetching user by primary key ', error);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: STATUS_MESSAGE.USER_NOT_FETCHED, status: STATUS_MESSAGE.ERROR });
  }
};

export const fetchUserByUserId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userSource: DataConditions = fetchExistingDataFromTableObject;
    userSource.modelName = DB_MODELS.UserDetailsModel;
    userSource.requiredWhereFields[0].conditionValue = {
      id,
      isActive: 1,
    };
    const { dataObject: fetchedUserByPrimaryKey } = (await commonDbExecution(userSource)) as GetDataResponse;
    const rolesSource: DataConditions = fetchDataFromTableObject;
    rolesSource.modelName = DB_MODELS.UserRoleMappingModel;
    rolesSource.requiredWhereFields[0].conditionValue = { userId: id };
    const { dataObjects: roles } = (await commonDbExecution(rolesSource)) as GetAllDataResponse;
    if (!fetchedUserByPrimaryKey) {
      res.status(STATUS_CODE.NOT_FOUND).json({ message: STATUS_MESSAGE.USER_NOT_FOUND, status: STATUS_MESSAGE.ERROR });
    }
    res
      .status(STATUS_CODE.SUCCESS)
      .json({ result: { user: fetchedUserByPrimaryKey, roles: roles }, status: STATUS_MESSAGE.SUCCESS });
  } catch (error) {
    logger.error('Error while fetching user by primary key ', error);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: STATUS_MESSAGE.USER_NOT_FETCHED, status: STATUS_MESSAGE.ERROR });
  }
};

export const userValidator = (req: Request, res: Response, next: NextFunction) => {
  const userSchema = Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(5).max(50).required(),
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    roleIds: Joi.array().items(Joi.string()),
  });
  const { userName, firstName, lastName, email, roleIds } = req.body;

  const { error } = userSchema.validate({
    userName,
    firstName,
    lastName,
    email,
    roleIds,
  });
  if (error) {
    logger.error('Error validating user details ', error.details[0].message); //error.details[0].message
    res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json({ message: 'Please enter valid user details', status: STATUS_MESSAGE.ERROR });
    return;
  }
  next();
};

export const addUserAndUserroleToDb = async (req: Request, res: Response) => {
  try {
    const { userName, firstName, lastName, email, roleIds } = req.body;
    const userObject = {
      userName,
      firstName,
      lastName,
      email,
      roleIds,
    };
    await addUserMethod(userObject);
    res.status(STATUS_CODE.SUCCESS).json({ message: STATUS_MESSAGE.USER_CREATED, status: STATUS_MESSAGE.SUCCESS });
  } catch (error) {
    if (error.name === ERROR.SEQUELIZE_UNIQUE_CONSTRAINT) {
      logger.error('User is already present ', error);
      res
        .status(STATUS_CODE.DATA_ALREADY_PRESENT)
        .json({ message: STATUS_MESSAGE.USER_IS_ALREADY_PRESENT, status: STATUS_MESSAGE.ERROR });
    }
    logger.error('Error while creating user ', error);
    res.status(STATUS_CODE.SERVER_ERROR).json({ message: STATUS_MESSAGE.USER_NOT_ADDED, status: STATUS_MESSAGE.ERROR });
    return;
  }
};

export const addUserMethod = async (userProps: UserObject) => {
  try {
    const { userName, firstName, lastName, email, roleIds } = userProps;
    createDataObject.modelName = DB_MODELS.UserDetailsModel;
    const userId = uuidv4();
    createDataObject.addObject = {
      id: userId,
      userName,
      firstName,
      lastName,
      email,
    };
    await commonDbExecution(createDataObject);
    fetchDataFromTableObject.modelName = DB_MODELS.RoleDetailsModel;
    fetchDataFromTableObject.requiredWhereFields[0].conditionValue = { id: roleIds };
    const { dataObjects: roles } = (await commonDbExecution(fetchDataFromTableObject)) as GetAllDataResponse;
    const userRoles = (roles as RoleDetailsModel[]).map(({ id: roleId }) => ({
      id: uuidv4(),
      userId: userId,
      roleId: roleId,
    }));
    const upserSource: DataConditions = {
      modelName: DB_MODELS.UserRoleMappingModel,
      functionType: DB_DATA_FUNCTIONS_TYPES.bulkUpsertDataInTable,
      upsertObjects: userRoles,
      ignoreDuplicates: true,
    };
    await commonDbExecution(upserSource);
  } catch (error) {
    logger.error('Failed to create user with role', error.message || error);
    throw error;
  }
};

export const deleteUserFromDb = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    deleteDataInTableObject.modelName = DB_MODELS.UserDetailsModel;
    deleteDataInTableObject.requiredWhereFields[0].conditionValue = { id };
    await commonDbExecution(deleteDataInTableObject);
    deleteDataInTableObject.modelName = DB_MODELS.UserRoleMappingModel;
    deleteDataInTableObject.requiredWhereFields[0].conditionValue = { userId: id };
    await commonDbExecution(deleteDataInTableObject);
    res.status(STATUS_CODE.SUCCESS).json({ message: STATUS_MESSAGE.USER_DELETED, status: STATUS_MESSAGE.SUCCESS });
  } catch (error) {
    if (error.name === ERROR.SEQUELIZE_VALIDATION) {
      logger.error('User not found ', error);
      res.status(STATUS_CODE.NOT_FOUND).json({ message: STATUS_MESSAGE.USER_NOT_FOUND, status: STATUS_MESSAGE.ERROR });
    }
    logger.error('Error while deleting user ', error);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: STATUS_MESSAGE.USER_NOT_DELETED, status: STATUS_MESSAGE.ERROR });
    return;
  }
};

export const updateUserToDb = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userName, firstName, lastName, email, roleIds } = req.body;
  try {
    const userObject = {
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      email: email,
    };
    updateDataInTableObject.modelName = DB_MODELS.UserDetailsModel;
    updateDataInTableObject.requiredWhereFields[0].conditionValue = { id };
    updateDataInTableObject.updateObject = userObject;
    //Update the user
    await commonDbExecution(updateDataInTableObject);

    if (roleIds) {
      //Fetching all the assigned roles and get the roleIds
      const rolesSource: DataConditions = fetchDataFromTableObject;
      rolesSource.modelName = DB_MODELS.UserRoleMappingModel;
      rolesSource.requiredWhereFields[0].conditionValue = { userId: id };
      const { dataObjects: rolesAndUsers } = (await commonDbExecution(rolesSource)) as GetAllDataResponse;
      // const rolesAndUsers = await fetchRoles(id);
      const roleIds = (rolesAndUsers as UserRoleMappingModel[]).map(({ roleId }) => roleId);

      //Get all the added and deleted roles if any
      const rolesToAdd = roleIds.filter((role: string) => !roleIds.includes(role));
      const rolesToDelete = roleIds.filter((role) => !roleIds.includes(role));

      //Add and delete all the userRoleMapping if needed
      if (rolesToDelete.length) {
        deleteDataInTableObject.modelName = DB_MODELS.UserRoleMappingModel;
        deleteDataInTableObject.requiredWhereFields[0].conditionValue = {
          userId: id,
          roleId: {
            [Op.in]: rolesToDelete,
          },
        };
        await commonDbExecution(deleteDataInTableObject);
      }
      const newRoles = rolesToAdd.map((role: string) => {
        return { id: uuidv4(), userId: id, roleId: role };
      });
      const upserSource: DataConditions = {
        modelName: DB_MODELS.UserRoleMappingModel,
        functionType: DB_DATA_FUNCTIONS_TYPES.bulkUpsertDataInTable,
        upsertObjects: newRoles,
        ignoreDuplicates: true,
      };
      await commonDbExecution(upserSource);
    }
    res.status(STATUS_CODE.SUCCESS).json({ message: STATUS_MESSAGE.USER_UPDATED, status: STATUS_MESSAGE.SUCCESS });
  } catch (error) {
    logger.error('Error while deleting user ', error);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: STATUS_MESSAGE.USER_NOT_UPDATED, status: STATUS_MESSAGE.ERROR });
  }
};
