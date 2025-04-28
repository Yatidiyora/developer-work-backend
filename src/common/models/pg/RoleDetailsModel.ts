import { DataTypes, Model, Sequelize } from 'sequelize';
import { TABLES } from '../../types/enums/CommonEnums';

export class RoleDetailsModel extends Model {
  public id: string;
  public name!: string;
  public description: string;
  public createdAt: Date;
  public updatedAt: Date;
}

export const initRoleDetailsModel = (sequelize: Sequelize) => {
  RoleDetailsModel.init(
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
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      tableName: TABLES.ROLE_DETAILS,
    },
  ).sync();
};
