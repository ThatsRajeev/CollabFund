import express from 'express';
import { fetchUserByAddress, createUser, updateUser } from '../controller/User.js';

const router = express.Router();
router.post('/:address', createUser)
      .get('/:address', fetchUserByAddress)
      .patch('/:address', updateUser);

export default router;
