import { DATE_CATEGORY_TYPE } from '../../../common/types/enums/CommonEnums';

export interface SalesRevenueDateCategory {
  categoryType: DATE_CATEGORY_TYPE;
  rangeValue: string | string[];
}

export interface SalesRevenuePayload {
  orderCategoryType?: string;
  subCategoryType?: string;
  dateCategory?: SalesRevenueDateCategory;
}

export interface SalesRevenueRecord {
  orderCategoryType: string;
  subCategoryType: string;
  salesOrder: number;
  productRevenue: number;
}
