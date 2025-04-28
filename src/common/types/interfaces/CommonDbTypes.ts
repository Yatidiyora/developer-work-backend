import { DB_DATA_FUNCTIONS_TYPES, JOIN_TYPE, SEQUELIZE_CONDITION_TYPES } from '../enums/CommonEnums';
import { FindAttributeOptions, GroupOption, Model, OrderItem, WhereOptions } from 'sequelize';

export interface WhereField {
  fieldName?: string;
  whereCondition: SEQUELIZE_CONDITION_TYPES;
  conditionValue: any; // You can replace 'any' with the specific type you expect, like 'string | null' if conditionValue can be a string or null.
}

export interface JoinModel {
  modelName: string;
  joinColumns: string[];
  joinType: JOIN_TYPE;
  joinModel: JoinModel[];
}
export interface JoinModelsType {
  modelName: string;
  joinColumns: string[];
  joinModel: JoinModel[];
}

export interface DataConditions {
  modelName?: string;
  joinModels?: JoinModelsType;
  requiredWhereFields?: WhereField[];
  functionType?: DB_DATA_FUNCTIONS_TYPES;
  addObject?: Partial<any>;
  updateObject?: Partial<any>;
  upsertObjects?: Partial<any>[];
  updateColumns?: string[];
  ignoreDuplicates?: boolean;
  whereCondition?: WhereOptions;
  paginationData?: {
    limit: number;
    offset: number;
    order?: OrderItem[];
  };
  requiredColumns?: FindAttributeOptions;
  group?: GroupOption;
  logging?: boolean;
  raw?: boolean;
}

export interface UpdateResponse {
  updateData: [affectedCount: number];
}

export interface GetDataResponse {
  dataObject: Model<any, any>;
}

export interface GetPaginationDataResponse {
  dataObjects: {
    rows: Model<any, any>[];
    count: number;
  };
}

export interface GetAllDataResponse {
  dataObjects: Model<any, any>[];
}
