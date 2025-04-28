import { col, Op, ProjectionAlias, Sequelize } from 'sequelize';
import { CustomerOrdersDetailsModel, OrderCategoryModel, sequelize } from '../../../common/models/pg';
import { customerOrdersJoinKey } from '../../../common/types/constants/RelationKeysConstants';
import { getCustomLogger } from '../../../common/utils/Logger';
import { DATE_CATEGORY_TYPE, SORT } from '../../../common/types/enums/CommonEnums';
import { SalesRevenueRecord } from 'interfaces/SalesRevenue';

const logger = getCustomLogger('Customer-orders::repository::CustomerOrdersRepository');

export const fetchCustomerOrders = async (props: any) => {
  const { id, size = 10, offset = 0, keyword, sortColumnName, sortOrder } = props;
  try {
    CustomerOrdersDetailsModel.belongsTo(OrderCategoryModel, customerOrdersJoinKey);
    return await CustomerOrdersDetailsModel.findAndCountAll({
      attributes: [
        'id',
        'customerId',
        'orderCategoryId',
        'orderName',
        'orderSerialNumber',
        'orderDeliveryAddress',
        'orderDeliveryStatus',
        'orderPrice',
        'createdAt',
        'updatedAt',
        [col('OrderCategoryModel.id'), 'orderId'],
        [col('OrderCategoryModel.order_category_type'), 'orderCategoryType'],
        [col('OrderCategoryModel.sub_category_type'), 'subCategoryType'],
      ],
      where: {
        [Op.or]: [
          // Add dynamic conditions from the second model (Order)
          ...['order_category_type'].map((field) =>
            Sequelize.where(Sequelize.col(`OrderCategoryModel.${field}`), { [Op.like]: `%${keyword ?? ''}%` }),
          ),
          ...['orderName', 'orderSerialNumber'].map((field) => ({
            [field]: { [Op.like]: `%${keyword ?? ''}%` },
          })),
        ],
        customerId: id,
      },
      include: [
        {
          model: OrderCategoryModel,
          attributes: [],
          required: true,
        },
      ],
      order: [
        ['orderCategoryType', 'subCategoryType'].includes(sortColumnName)
          ? [{ model: OrderCategoryModel, as: 'OrderCategoryModel' }, sortColumnName, sortOrder]
          : [sortColumnName, sortOrder],
      ],
      limit: size,
      offset,
      raw: true,
    });
  } catch (error) {
    logger.error('Failed to fetch customer orders details', error.message || error);
    throw error;
  }
};

export const getSalesOrderRevenue = async (props: any): Promise<SalesRevenueRecord[]> => {
  const { searchObject, dateRangeObject, groups = [] } = props;
  const searchArray = Object.keys(searchObject);
  const dateRangeTypeArray = Object.keys(dateRangeObject);
  try {
    CustomerOrdersDetailsModel.belongsTo(OrderCategoryModel, customerOrdersJoinKey);
    return (await CustomerOrdersDetailsModel.findAll({
      attributes: [
        ...Object.entries(groups).map(([key, field]: [key: string, field: string]) => {
          return [col(field),key] as ProjectionAlias;
        }),
        // [col('OrderCategoryModel.order_category_type'), 'orderCategoryType'],
        // [col('OrderCategoryModel.sub_category_type'), 'subCategoryType'],
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'salesOrder'],
        [Sequelize.fn('SUM', Sequelize.col('order_price')), 'productRevenue'],
      ],
      where: {
        [Op.and]: [
          ...searchArray.map((field) =>
            Sequelize.where(Sequelize.col(`OrderCategoryModel.${field}`), { [Op.eq]: searchObject[field] }),
          ),
          ...dateRangeTypeArray.map((rangeType: DATE_CATEGORY_TYPE) => {
            if (Object.values(DATE_CATEGORY_TYPE).slice(0, -2).includes(rangeType)) {
              return Sequelize.where(
                Sequelize.fn('EXTRACT', Sequelize.literal(`${rangeType.toUpperCase()} FROM "order_date"`)),
                dateRangeObject[rangeType],
              );
            } else if (rangeType === DATE_CATEGORY_TYPE.DATE) {
              return { order_date: dateRangeObject[rangeType] };
            } else if (rangeType === DATE_CATEGORY_TYPE.RANGE) {
              return { order_date: {[Op.between]: dateRangeObject[rangeType]}}
            }
          }),
        ],
      },
      include: [
        {
          model: OrderCategoryModel,
          attributes: [],
          required: true,
        },
      ],
      group: Object.values(groups),
      order: [['productRevenue', SORT.DESC]],
      raw: true,
      logging: true,
    })) as unknown as SalesRevenueRecord[];
  } catch (error) {
    logger.error('Failed to fetch customer orders details', error.message || error);
    throw error;
  }
};
