import { DataTypes, Model, Sequelize } from 'sequelize';
import { TABLES } from '../../types/enums/CommonEnums';

export class CustomerOrdersDetailsModel extends Model {
  public id: string;
  public customerId: string;
  public orderCategoryId: string;
  public orderName: string;
  public orderSerialNumber: string;
  public orderDeliveryAddress: string;
  public orderDeliveryStatus: string;
  public orderPrice: number;
  public createdAt: Date;
  public updatedAt: Date;
}

export const initCustomerOrdersDetailsModel = (sequelize: Sequelize) => {
  CustomerOrdersDetailsModel.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      customerId: {
        type: DataTypes.UUID,
      },
      orderCategoryId: {
        type: DataTypes.UUID,
      },
      orderName: {
        type: DataTypes.STRING,
      },
      orderSerialNumber: {
        type: DataTypes.STRING,
      },
      orderDeliveryAddress: {
        type: DataTypes.STRING,
      },
      orderDeliveryStatus: {
        type: DataTypes.STRING,
      },
      orderPrice: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      tableName: TABLES.CUSTOMER_ORDERS_DETAILS,
    },
  ).sync();
};
