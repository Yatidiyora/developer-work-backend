import { DataTypes, Model, Sequelize } from 'sequelize';
import { TABLES } from '../../types/enums/CommonEnums';

export class CustomerDetailsModel extends Model {
  public id: string;
  public customerName: string;
  public userName: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public contactType: string;
  public contactInfo: string;
  public lastActiveDate: Date;
  public createdAt: Date;
  public updatedAt: Date;
}

export const initCustomerDetailsModel = (sequelize: Sequelize) => {
  CustomerDetailsModel.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      customerName: {
        type: DataTypes.STRING,
      },
      userName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      contactType: {
        type: DataTypes.STRING,
      },
      contactInfo: {
        type: DataTypes.STRING,
      },
      lastActiveDate: {
        type: DataTypes.DATE,
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
      timestamps: true,
      freezeTableName: true,
      underscored: true,
      tableName: TABLES.CUSTOMER_DETAILS,
    },
  ).sync();
};
