require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000; // 🔄 MODIFIÉ

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/api-portfolio')
    .then(() => console.log('✅ MongoDB connecté sur:', process.env.MONGODB_URI || 'mongodb://localhost:27017/api-portfolio'))
    .catch(err => console.error('❌ Erreur MongoDB:', err));

const authRoutes = require('./routes/auth');

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({
        message: '🍷 API Portfolio de Pierre avec authentification JWT',
        endpoints: {
            'POST /auth/register': 'S\'inscrire avec username et password',
            'POST /auth/login': 'Se connecter avec username et password'
        },
        exemple: {
            register: {
                method: 'POST',
                url: '/auth/register',
                body: { "username": "votre_username", "password": "votre_password" }
            },
            login: {
                method: 'POST',
                url: '/auth/login',
                body: { "username": "votre_username", "password": "votre_password" }
            }
        }
    });
});

app.listen(port, () => {
    console.log(`🚀 Serveur démarré avec succès sur: http://localhost:${port}`);
});