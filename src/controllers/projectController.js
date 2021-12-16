const Project = require('../models/Project');
const Task = require('../models/Task');
async function listProject(request, response) {
  try {
    const projects = await Project.find().populate(['user', 'tasks']);

    return response.json({ projects })
  } catch (error) {
    return response.status(400).json({ error: 'Error on loading projects' });
  }

}

async function showProject(request, response) {
  const { projectId } = request.params;

  try {
    const project = await Project.findById(projectId).populate(['user', 'tasks']);

    if (!project) return response.status(404).json({ error: 'Project not found' })

    return response.json({ project });
  } catch (error) {
    return response.status(400).json({ error: 'Error on loading project' });

  }
}

async function createProject(request, response) {
  const { title, description, tasks } = request.body;
  try {
    const project = await Project.create({ title, description, user: request.userId });

    await Promise.all(
      tasks.map(async task => {
        const projectTask = await Task.create({ ...task, assignedTo: request.userId, project: project._id });

        await projectTask.save();

        project.tasks.push(projectTask);
      })
    );

    await project.save();

    return response.json({ project });
  } catch (error) {
    console.log(error.message)
    return response.status(400).json({ error: 'Error creating new project' });
  }
}

async function updateProject(request, response) {
  const { title, description, tasks } = request.body;
  const { projectId } = request.params;
  try {
    const project = await Project.findByIdAndUpdate(projectId, {
      title,
      description,

    }, { new: true });

    project.tasks = [];
    Task.remove({ project: project._id })

    await Promise.all(
      tasks.map(async task => {
        const projectTask = await Task.create({ ...task, assignedTo: request.userId, project: project._id });

        await projectTask.save();

        project.tasks.push(projectTask);
      })
    );

    await project.save();

    return response.json({ project });
  } catch (error) {
    console.log(error.message)
    return response.status(400).json({ error: 'Error updating project' });
  }
}

async function deleteProject(request, response) {
  const { projectId } = request.params;

  try {
    await Project.findByIdAndRemove(projectId);
    return response.json({ message: 'Deleted project success' });

  } catch (error) {
    return response.status(400).json({ error: 'Error on delete project' });

  }

}
module.exports = {
  listProject,
  showProject,
  createProject,
  updateProject,
  deleteProject
}