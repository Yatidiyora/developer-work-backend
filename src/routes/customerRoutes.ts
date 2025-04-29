import express from 'express';
import * as CustomerService from '../lib/customers/service/CustomerService';
import { validatePermission } from '../auth/middleWare/validatePermission';
import { MODULE, ACTION } from '../common/types/enums/CommonEnums';
import { fetchAllCustomerOrders } from '../lib/customer-orders/service/CustomerOrdersService';

const router = express.Router();

router.get('/', validatePermission(MODULE.CUSTOMER, ACTION.VIEW), CustomerService.fetchAllCustomers);
router.get('/orders', validatePermission(MODULE.CUSTOMER, ACTION.VIEW), fetchAllCustomerOrders);
router.get('/details/:id', validatePermission(MODULE.CUSTOMER, ACTION.VIEW), CustomerService.fetchCustomerDetails);

export default router;
