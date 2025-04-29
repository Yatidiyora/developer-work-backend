import express from 'express';
import {
  fetchAllRolesPermissions,
  fetchPermissionsFromUserId,
} from '../lib/role-permission/service/RolePermissionService';

const router = express.Router();

router.get('/', fetchPermissionsFromUserId);
router.get('/all', fetchAllRolesPermissions);

export default router;
