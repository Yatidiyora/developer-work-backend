import { DataTypes, Model, Sequelize } from 'sequelize';
import { TABLES } from '../../types/enums/CommonEnums';

export class UserRoleMappingModel extends Model {
  public id: string;
  public userId!: string;
  public roleId!: string;
  public createdAt: Date;
  public updatedAt: Date;
}

export const initUserRoleMappingModel = (sequelize: Sequelize) => {
  UserRoleMappingModel.init(
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: true,
      underscored: true,
      tableName: TABLES.USER_ROLE_MAPPING,
    },
  ).sync();
};
