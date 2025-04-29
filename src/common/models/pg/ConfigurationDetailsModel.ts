import { DataTypes, Model, Sequelize } from 'sequelize';
import { TABLES } from '../../types/enums/CommonEnums';

export class ConfigurationDetailsModel extends Model {
  public key: string;
  public value: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}

export const initConfigurationDetailsModel = (sequelize: Sequelize) => {
  ConfigurationDetailsModel.init(
    {
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      value: {
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
      underscored: true,
      timestamps: true,
      tableName: TABLES.CONFIGURATION,
    },
  ).sync();
};
