import express from 'express';
import * as RoleService from '../lib/roles/service/RolesService';
import { validatePermission } from '../auth/middleWare/validatePermission';
import { MODULE, ACTION } from '../common/types/enums/CommonEnums';

const router = express.Router();

//shared routes
router.get('/', validatePermission(MODULE.ROLE, ACTION.VIEW), RoleService.fetchAllRoles);
router.get('/search', validatePermission(MODULE.ROLE, ACTION.VIEW), RoleService.fetchRoleByRoleName);
router.get('/:id', validatePermission(MODULE.ROLE, ACTION.VIEW), RoleService.fetchRoleByRoleId);

//protected routes
router.post('/', validatePermission(MODULE.ROLE, ACTION.UPDATE), RoleService.addRoleToDb);
router.post('/:id', validatePermission(MODULE.ROLE, ACTION.UPDATE), RoleService.updateRoleToDb);
router.delete('/:id', validatePermission(MODULE.ROLE, ACTION.DELETE), RoleService.deleteRoleFromDb);

export default router;
