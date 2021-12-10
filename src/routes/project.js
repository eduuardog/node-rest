const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");

const projectsRoutes = Router();

projectsRoutes.use(authMiddleware);

projectsRoutes.get('/', (request, response) => {
  return response.send(request.userId);
})


module.exports = projectsRoutes;