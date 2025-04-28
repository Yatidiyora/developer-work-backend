export enum STATUS_MESSAGE {
  OK = 'OK',
  ROLE_CREATED = 'Role created successfully',
  ROLE_DELETED = 'Role deleted successfully',
  ROLE_UPDATED = 'Role updated successfully',
  ROLE_NOT_UPDATED = 'Failed to update role',
  ROLE_NAME_NOT_PRESENT = 'Please add valid role name',
  ROLE_NOT_FOUND = 'Role not found',
  ROLE_IS_ALREADY_PRESENT = 'Role is already present',
  ROLE_NOT_DELETED = 'Failed to delete role',
  ROLE_NOT_CREATED = 'Failed to create role',
  ROLE_NOT_FETCHED = 'Failed to fetch roles',

  USER_CREATED = 'User created successfully',
  USER_DELETED = 'User deleted successfully',
  USER_UPDATED = 'User updated successfully',
  USER_NOT_UPDATED = 'Failed to update user',
  USER_NOT_FETCHED = 'Failed to fetch users',
  USER_NOT_CREATED = 'Failed to create user',
  USER_NOT_DELETED = 'Failed to delete user',
  USER_NOT_ADDED = 'Failed to add user',
  USER_NOT_FOUND = 'User not found',
  USER_IS_ALREADY_PRESENT = 'User is already present',

  FAILED_TO_FETCH_SALES_REVENUE = 'Failed to fetch sales revenue',

  PERMISSIONS_NOT_FOUND = 'Permissions not found',

  UNAUTHORIZED = "You don't have sufficient permissions to perform action",

  ERROR = 'Error',
  SUCCESS = 'Success',
  TIME_OUT = 'Timeout error',
  DATA_ALREADY_PRESENT = 'Data already exist',
  NOT_EXIST = 'Data not exist',
}

export enum COMMON_COLUMNS {
  UPDATED_AT = 'updatedAt',
  ID = 'id',
}

export enum STATUS_CODE {
  SUCCESS = 200,
  SERVER_ERROR = 500,
  NOT_FOUND = 404,
  DATA_ALREADY_PRESENT = 409,
  UNAUTHORIZED = 401,
  TIME_OUT = 504,
}

export enum ERROR {
  SEQUELIZE_UNIQUE_CONSTRAINT = 'SequelizeUniqueConstraintError',
  SEQUELIZE_VALIDATION = 'SequelizeValidationError',
}

export enum TABLES {
  USER_DETAILS = 'user_details',
  ROLE_DETAILS = 'role_details',
  USER_ROLE_MAPPING = 'user_role_mapping',
  PERMISSION_DETAILS = 'permission_details',
  ROLE_PERMISSION_DETAILS = 'role_permission_details',
  CONFIGURATION = 'configuration',
  CUSTOMER_DETAILS = 'customer_details',
  CUSTOMER_ORDERS_DETAILS = 'customer_orders_details',
  ORDER_CATEGORY_DETAILS = 'order_category_details',
}

export enum MODULE {
  USER = 'Manage Users',
  ROLE = 'Manage Roles',
  CUSTOMER = 'Manage Customers',
  SALES_REVENUE = 'Sales Revenue'
}

export enum ACTION {
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
}

export enum FORMAT {
  DATE = 'YYYY-MM-DD',
  S3_DATE = 'YYYY/MM/DD',
  REVERSE_DATE = 'DD-MM-YYYY',
  START_MONTH_DATE = 'MM-DD-YYYY',
  DAY = 'day',
  MILLISECONDS = 'milliseconds',
  MINUTE = 'minutes',
  HOURS = 'hours',
  SECONDS = 'seconds',
  UNI_FOCUS_DATE = 'YYYY-MM-DDTHH:mm:ss',
  MM = 'mm',
  SS = 'ss',
  SQL = 'YYYY-MM-DD HH:mm:ss',
  HH_MM = 'HH:mm',
  DAYS = 'days',
  SFTP_DATE = 'MM/DD/YYYY',
  ONLY_DATE = 'date',
  MONTH = 'month',
  ZIP_FORMAT = 'YYYY_MM_DDTHH_mm_ss',
  YEARS = 'years',
  X_PADDING_HOURS = 'H:mm',
  JSON = 'YYYYMMDDHHmmss',
  S3_FOLDER_STRUCTURE = 'YYYY/MM',
}

export enum INCLUSIVE {
  BOTH = '[]',
  EXCLUDE_BOTH = '()',
  EXCLUDE_RIGHT = '[)',
  EXCLUDE_LEFT = '(]',
}

export enum SCHEDULE_DETAILS {
  PENDING_STATUS = 'Pending',
  FAIL_STATUS = 'Failed',
  COMPLETE_STATUS = 'Completed',
  PROCESSING_STATUS = 'Processing',
  IN_QUEUE = 'InQueue',
  PARTIAL_COMPLETED = 'Partial Completed',
}

export enum SORT {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum JOIN_TYPE {
  INNER_JOIN = 'INNER_JOIN',
  LEFT_JOIN = 'LEFT_JOIN'
}

export enum EVENT_SOURCE {
  AMAZON_CONNECT = 'Amazon Connect',
}

export enum S3_CONTENT_TYPE {
  CSV = 'text/csv',
  EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ZIP = 'application/zip',
  JSON = 'application/json',
}

export enum ActiveStatus {
  Zero = 0,
  One = 1,
}

export enum SUPER_STATE_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum DB_MODELS {
  ConfigurationDetailsModel = 'ConfigurationDetailsModel',
  UserDetailsModel = 'UserDetailsModel',
  UserRoleMappingModel = 'UserRoleMappingModel',
  RoleDetailsModel = 'RoleDetailsModel',
  RolePermissionDetailsModel = 'RolePermissionDetailsModel',
  PermissionDetailsModel = 'PermissionDetailsModel',
  CustomerDetailsModel = 'CustomerDetailsModel',
  CustomerOrdersDetailsModel = 'CustomerOrdersDetailsModel',
}

export enum DB_DATA_FUNCTIONS_TYPES {
  fetchDataFromTable = 'fetchDataFromTable',
  fetchDataFromTableWithPagination = 'fetchDataFromTableWithPagination',
  fetchExistingDataFromTable = 'fetchExistingDataFromTable',
  updateDataInTable = 'updateDataInTable',
  addDataInTable = 'addDataInTable',
  bulkUpsertDataInTable = 'bulkUpsertDataInTable',
  bulkCreateDataInTable = 'bulkCreateDataInTable',
  deleteDataInTable = 'deleteDataInTable',
}

export enum SEQUELIZE_CONDITION_TYPES {
  lte = 'lte',
  and = 'and',
  gte = 'gte',
  lt = 'lt',
  gt = 'gt',
  eq = 'eq',
  iLike = 'iLike',
  in = 'in',
  like = 'like',
  ne = 'ne',
  not = 'not',
  notIn = 'notIn',
  notLike = 'notLike',
  startsWith = 'startsWith',
  contains = 'contains',
  endsWith = 'endsWith',
  is = 'is',
  iRegexp = 'iRegexp',
  noExtendLeft = 'noExtendLeft',
  noExtendRight = 'noExtendRight',
  between = 'between',
}

export enum SIGNUP_TYPE {
  SIGN_UP = 'signUp',
  LOG_IN = 'logIn'
}

export enum DATE_CATEGORY_TYPE {
  YEAR = 'year',
  MONTH = 'month',
  DATE = 'date',
  RANGE = 'range'
}
