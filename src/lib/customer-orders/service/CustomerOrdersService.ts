import { Request, Response } from 'express';
import { COMMON_COLUMNS, SORT, STATUS_CODE, STATUS_MESSAGE } from '../../../common/types/enums/CommonEnums';
import { SalesRevenuePayload } from '../../../common/types/interfaces/SalesRevenue';
import { RequestQuery } from '../../../common/types/interfaces/UserInterface';
import { getCustomLogger } from '../../../common/utils/Logger';
import { fetchCustomerOrders, getSalesOrderRevenue } from '../repository/CustomerOrdersRepository';

const logger = getCustomLogger('Customer-orders::service::CustomerOrdersService');

export const fetchAllCustomerOrders = async (req: Request, res: Response) => {
  const {
    id,
    size,
    offset,
    keyword,
    sortColumnName = COMMON_COLUMNS.UPDATED_AT,
    sortOrder = SORT.DESC,
  } = req.query as Partial<RequestQuery>;
  try {
    const { rows, count } = await fetchCustomerOrders({ id, size, offset, keyword, sortColumnName, sortOrder });
    res.status(STATUS_CODE.SUCCESS).json({ result: rows, total: count, status: STATUS_MESSAGE.SUCCESS });
  } catch (error) {
    logger.error('Error while fetching orders ', error.message || error);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: STATUS_MESSAGE.USER_NOT_FETCHED, status: STATUS_MESSAGE.ERROR });
  }
};

export const fetchSalesRevenue = async (req: Request, res: Response) => {
  try {
    const { orderCategoryType, subCategoryType, dateCategory } = req.body as SalesRevenuePayload;
    const searchObject = {
      order_category_type: orderCategoryType,
      ...(subCategoryType && { sub_category_type: subCategoryType }),
    };
    const dateRangeObject = {
      [dateCategory.categoryType]: dateCategory.rangeValue,
    };

    const groups = {
      orderCategoryType: 'OrderCategoryModel.order_category_type',
      ...(orderCategoryType && { subCategoryType: 'OrderCategoryModel.sub_category_type' }),
      ...(subCategoryType && { productCategoryType: 'CustomerOrdersDetailsModel.order_name' }),
    };
    const revenueRecords = await getSalesOrderRevenue({ searchObject, dateRangeObject, groups });

    logger.info('RevenueRecords: ', revenueRecords);
    res.status(STATUS_CODE.SUCCESS).json({ result: revenueRecords, status: STATUS_MESSAGE.SUCCESS });
  } catch (error) {
    logger.error('Failed to fetch sales revenue', error.message || error);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: STATUS_MESSAGE.FAILED_TO_FETCH_SALES_REVENUE, status: STATUS_MESSAGE.SUCCESS });
  }
};
