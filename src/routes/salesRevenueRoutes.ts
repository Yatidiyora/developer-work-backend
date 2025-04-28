import express from 'express';
import { validatePermission } from '../auth/middleWare/validatePermission';
import { ACTION, MODULE } from '../common/types/enums/CommonEnums';
import { fetchSalesRevenue } from '../lib/customer-orders/service/CustomerOrdersService';

const router = express.Router();

router.post('/sales-revenue', validatePermission(MODULE.SALES_REVENUE, ACTION.VIEW), fetchSalesRevenue);

export default router;