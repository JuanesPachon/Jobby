import { Router } from 'express';
import {
    createTaskController,
    getTaskByIdController,
    getTasksController,
    getMyTasksController,
    getTaskApplicationsController,
    applyToTaskController,
    selectApplicantController,
    deselectApplicantController,
    startTaskController,
    checkApplicationController,
    withdrawApplicationController,
    cancelTaskController,
    completeTaskController,
    getMyApplicationsController,
    cleanupOldCancelledTasksController,
} from '../controllers/taskController.js';
import errorsIsEmpty from '../middlewares/errorIsEmpty.js';
import { createTaskValidations } from '../middlewares/validateTask.js';
import { createApplicationValidations } from '../middlewares/validateApplication.js';
import { selectApplicantValidations } from '../middlewares/validateSelectApplicant.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = Router();

router.get('/tasks', verifyToken, getTasksController);
router.get('/tasks/:id', verifyToken, getTaskByIdController);
router.get('/tasks/:id/check-application', verifyToken, checkApplicationController);
router.post('/tasks', verifyToken, createTaskValidations, errorsIsEmpty, createTaskController);
router.post(
    '/tasks/apply/:id',
    verifyToken,
    createApplicationValidations,
    errorsIsEmpty,
    applyToTaskController
);
router.delete('/tasks/withdraw/:id', verifyToken, withdrawApplicationController);

router.get('/my-tasks', verifyToken, getMyTasksController);
router.get('/my-tasks/applications/:id', verifyToken, getTaskApplicationsController);
router.get('/my-applications', verifyToken, getMyApplicationsController);

router.put(
    '/my-tasks/select/:id/',
    verifyToken,
    selectApplicantValidations,
    errorsIsEmpty,
    selectApplicantController
);
router.put('/my-tasks/deselect/:id/', verifyToken, deselectApplicantController);
router.put('/my-tasks/start/:id/', verifyToken, startTaskController);
router.put('/my-tasks/complete/:id', verifyToken, completeTaskController);
router.delete('/my-tasks/cancel/:id', verifyToken, cancelTaskController);

router.post('/cleanup-cancelled-tasks', verifyToken, cleanupOldCancelledTasksController);

export default router;
