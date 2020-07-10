const ss = require('@ss');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    info: { // API informations (required)
        title: 'Auth Service', // Title (required)
        version: '1.0.0', // Version (required)
        description: 'Auth API' // Description (optional)
    },
};

const options = {
    // Import swaggerDefinitions
    swaggerDefinition,
    // Path to the API docs
    apis: ['./routes/index.js', './users/index.js', './roles/index.js']
};

module.exports = async () => {
    await ss.configs.ready();
    await mongo.ready();
};