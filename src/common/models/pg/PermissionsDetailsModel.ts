import { DataTypes, Model, Sequelize } from 'sequelize';
import { TABLES } from '../../types/enums/CommonEnums';

export class PermissionDetailsModel extends Model {
  public id: string;
  public name: string;
  public createdAt: Date;
  public updatedAt: Date;
}

export const initPermissionDetailsModel = (sequelize: Sequelize) => {
  PermissionDetailsModel.init(
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      tableName: TABLES.PERMISSION_DETAILS,
    },
  ).sync();
};
