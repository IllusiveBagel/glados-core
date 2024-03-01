import express from 'express';
import controller from '../controllers/command.controller';

const router = express.Router();

router.get('/', controller.processCommand);

export default router;