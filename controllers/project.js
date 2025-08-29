const Project = require('../models/Project');

async function createProject(req, res) {
    try {
        const { name, description } = req.body;
        const userId = req.user.userId;

        if (!name || !description) {
            return res.status(400).json({
                error: '🔴 Le nom et la description sont requis'
            });
        }

        const project = new Project({
            name,
            description,
            user: userId
        });

        const savedProject = await project.save();
        
        res.status(201).json({
            message: '🎉 Projet créé avec succès !',
            project: savedProject
        });

    } catch (error) {
        console.error('Erreur création projet:', error);
        res.status(500).json({
            error: '🔴 Erreur lors de la création du projet'
        });
    }
}

async function getProjects(req, res) {
    try {
        const projects = await Project.find()
            .sort({ createdAt: -1 })
            .populate('user', 'username');

        res.json({
            message: `📋 ${projects.length} projet(s) trouvé(s)`,
            projects: projects
        });

    } catch (error) {
        console.error('Erreur récupération projets:', error);
        res.status(500).json({
            error: '🔴 Erreur lors de la récupération des projets'
        });
    }
}

async function getProject(req, res) {
    try {
        const { id } = req.params;

        const project = await Project.findById(id).populate('user', 'username');

        if (!project) {
            return res.status(404).json({
                error: '🔴 Projet non trouvé'
            });
        }

        res.json({
            message: '📋 Projet trouvé',
            project: project
        });

    } catch (error) {
        console.error('Erreur récupération projet:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                error: '🔴 ID de projet invalide'
            });
        }

        res.status(500).json({
            error: '🔴 Erreur lors de la récupération du projet'
        });
    }
}

async function updateProject(req, res) {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const userId = req.user.userId;

        if (!name || !description) {
            return res.status(400).json({
                error: '🔴 Le nom et la description sont requis'
            });
        }

        const project = await Project.findOneAndUpdate(
            { _id: id, user: userId },
            { name, description },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({
                error: '🔴 Projet non trouvé ou vous n\'avez pas les permissions'
            });
        }

        res.json({
            message: '✅ Projet mis à jour avec succès !',
            project: project
        });

    } catch (error) {
        console.error('Erreur mise à jour projet:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                error: '🔴 ID de projet invalide'
            });
        }

        res.status(500).json({
            error: '🔴 Erreur lors de la mise à jour du projet'
        });
    }
}

async function deleteProject(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const project = await Project.findOneAndDelete({ _id: id, user: userId });

        if (!project) {
            return res.status(404).json({
                error: '🔴 Projet non trouvé ou vous n\'avez pas les permissions'
            });
        }

        res.json({
            message: '🗑️ Projet supprimé avec succès !',
            deletedProject: project
        });

    } catch (error) {
        console.error('Erreur suppression projet:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                error: '🔴 ID de projet invalide'
            });
        }

        res.status(500).json({
            error: '🔴 Erreur lors de la suppression du projet'
        });
    }
}

module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject
};
