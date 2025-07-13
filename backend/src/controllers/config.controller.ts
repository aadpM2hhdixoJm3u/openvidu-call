import { Request, Response } from 'express';
import { CALL_PRIVATE_ACCESS, AUTH_MODE } from '../config.js';
import { LoggerService } from '../services/logger.service.js';

const logger = LoggerService.getInstance();

export const getConfig = async (req: Request, res: Response) => {
	logger.verbose('Getting config');
        const response = { isPrivateAccess: CALL_PRIVATE_ACCESS === 'true', authMode: AUTH_MODE };
	return res.status(200).json(response);
};
