import { Router } from 'express';
import bodyParser from 'body-parser';
import * as roomCtrl from '../controllers/room.controller.js';
import * as recordingCtrl from '../controllers/recording.controller.js';
import * as broadcastCtrl from '../controllers/broadcasting.controller.js';
import * as authCtrl from '../controllers/auth.controller.js';
import { getConfig } from '../controllers/config.controller.js';
import { healthCheck } from '../controllers/healthcheck.controller.js';
import { AuthStrategyService } from '../services/index.js';

const authStrategy = AuthStrategyService.getInstance();

const apiRouter = Router();

apiRouter.use(bodyParser.urlencoded({ extended: true }));
apiRouter.use(bodyParser.json());

// Room Routes
apiRouter.post('/rooms', authStrategy.userAuth(), roomCtrl.createRoom);

// Recording Routes
apiRouter.post('/recordings', authStrategy.userAuth(), recordingCtrl.startRecording);
apiRouter.put('/recordings/:recordingId', authStrategy.userAuth(), recordingCtrl.stopRecording);
apiRouter.get('/recordings/:recordingId/stream', recordingCtrl.streamRecording);
apiRouter.delete('/recordings/:recordingId', authStrategy.userAuth(), recordingCtrl.deleteRecording);

apiRouter.get('/admin/recordings', authStrategy.adminAuth(), recordingCtrl.getAllRecordings);
apiRouter.delete('/admin/recordings/:recordingId', authStrategy.adminAuth(), recordingCtrl.deleteRecording);

// Broadcasting Routes
apiRouter.post('/broadcasts', authStrategy.userAuth(), broadcastCtrl.startBroadcasting);
apiRouter.put('/broadcasts/:broadcastId', authStrategy.userAuth(), broadcastCtrl.stopBroadcasting);

// Auth Routes
apiRouter.post('/login', authCtrl.login);
apiRouter.post('/logout', authCtrl.logout);
apiRouter.post('/admin/login', authCtrl.adminLogin);
apiRouter.post('/admin/logout', authCtrl.adminLogout);
apiRouter.get('/auth/oidc/callback', authCtrl.oidcCallback);
apiRouter.post('/auth/saml/callback', authCtrl.samlCallback);

// Config Routes
apiRouter.get('/config', getConfig);

// Health Check Route
apiRouter.get('/healthcheck', authStrategy.userOrAdminAuth(), healthCheck);

export { apiRouter };
