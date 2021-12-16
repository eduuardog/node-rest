const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const projectsController = require('../controllers/projectController');
const projectsRoutes = Router();

projectsRoutes.use(authMiddleware);

projectsRoutes.get('/', projectsController.listProject)
projectsRoutes.get('/:projectId', projectsController.showProject)
projectsRoutes.post('/', projectsController.createProject)
projectsRoutes.put('/:projectId', projectsController.updateProject)
projectsRoutes.delete('/:projectId', projectsController.deleteProject)


module.exports = projectsRoutes;