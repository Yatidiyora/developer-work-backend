export interface UpdateUserRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface RequestUser {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
  iat: string;
  exp: string;
}

export interface UserRoleMapping {
  id: string;
  userId: string;
  roleId: string;
}

export type RequestQuery = {
  id: number;
  size: string;
  offset: string;
  sortColumnName: string;
  sortOrder: string;
  keyword: string;
  keyWord: string;
  status: string | number;
  agentId: string;
  scheduleDate: string;
  allFields: string;
  agentType: string;
  perBatch: string;
  actionType: string;
};

export interface KeyValuePairData {
  [key: string]: string | number;
}

export interface UserObject {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  roleIds: string[];
}
