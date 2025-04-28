import express from 'express';
import * as userService from '../lib/users/service/UserService';
import { validatePermission } from '../auth/middleWare/validatePermission';
const router = express.Router();
import { MODULE, ACTION } from '../common/types/enums/CommonEnums';

//shared routes
router.get('/', validatePermission(MODULE.USER, ACTION.VIEW), userService.fetchAllUsers);
router.get('/search', validatePermission(MODULE.USER, ACTION.VIEW), userService.fetchUserByUserName);
router.get('/:id', validatePermission(MODULE.USER, ACTION.VIEW), userService.fetchUserByUserId);

//protected routes
router.post(
  '/',
  validatePermission(MODULE.USER, ACTION.UPDATE),
  userService.userValidator,
  userService.addUserAndUserroleToDb,
);
router.post('/:id', validatePermission(MODULE.USER, ACTION.UPDATE), userService.updateUserToDb);
router.delete('/:id', validatePermission(MODULE.USER, ACTION.DELETE), userService.deleteUserFromDb);

export default router;
