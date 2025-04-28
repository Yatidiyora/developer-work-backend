import { DataTypes, Model, Sequelize } from 'sequelize';
import { TABLES } from '../../types/enums/CommonEnums';

export class RolePermissionDetailsModel extends Model {
  public id: number;
  public roleId: string;
  public permissionId: string;
  public permissionName: string;
  public view: number;
  public edit: number;
  public delete: number;
  public createdAt: Date;
  public updatedAt: Date;
}

export const initRolePermissionDetailsModel = (sequelize: Sequelize) => {
  RolePermissionDetailsModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      roleId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      permissionId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      permissionName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      view: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      edit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      delete: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['role_id', 'permission_id'], // Define composite unique constraint
        },
      ],
      sequelize,
      freezeTableName: true,
      underscored: true,
      tableName: TABLES.ROLE_PERMISSION_DETAILS,
    },
  ).sync();
};
