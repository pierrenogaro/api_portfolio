const { Router } = require('express');
const { 
    createProject, 
    getProjects, 
    getProject, 
    updateProject, 
    deleteProject 
} = require('../controllers/project');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', authMiddleware, createProject);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

module.exports = router;
