import { DataTypes, Model, Sequelize } from 'sequelize';
import { TABLES } from '../../types/enums/CommonEnums';

export class OrderCategoryModel extends Model {
  public id: string;
  public orderCategoryType: string;
  public subCategoryType: string;
  public createdAt: Date;
  public updatedAt: Date;
}

export const initOrderCategoryModel = (sequelize: Sequelize) => {
  OrderCategoryModel.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      orderCategoryType: {
        type: DataTypes.STRING,
      },
      subCategoryType: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      tableName: TABLES.ORDER_CATEGORY_DETAILS,
    },
  ).sync();
};
