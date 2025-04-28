import { DataTypes, Model, Sequelize } from 'sequelize';
import { TABLES } from '../../types/enums/CommonEnums';

export class UserDetailsModel extends Model {
  public id: string;
  public userName!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public isActive: number;
  public tokenMaxAge: Date;
  public createdAt: Date;
  public updatedAt: Date;
}

export const initUserDetailsModel = (sequelize: Sequelize) => {
  UserDetailsModel.init(
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      isActive: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      tokenMaxAge: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      tableName: TABLES.USER_DETAILS,
    },
  ).sync();
};
