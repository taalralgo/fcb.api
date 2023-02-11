const seeder = require('mongoose-seed');
const config = require('../config')
seeder.connect(config.mongoUrl, function () {

    // Load Mongoose models
    seeder.loadModels([
        'models/roles',
        'models/user',
        'models/category',
    ]);

    // Clear specified collections
    seeder.clearModels(['Role', 'User', 'Category'], function () {

        // Callback to populate DB once collections have been cleared
        seeder.populateModels(data, function () {
            seeder.disconnect();
        });

    });
});

const data = [
    {
        model: 'Role',
        documents: [
            {
                _id: '5ec53b803f280d9480f52e57',
                name: "Admin",
            },
            {
                name: "Follower",
            },
        ]
    },
    {
        model: 'User',
        documents: [
            {
                firstName: "Full",
                lastName: "Admin",
                email: "taalralgo@gmail.com",
                // phone: "777777777",
                password: "admin",
                role: "5ec53b803f280d9480f52e57",
            },
        ]
    },
    {
        model: 'Category',
        documents: [
            {
                name: "News",
            },
            {
                name: "LaLiga",
            },
            {
                name: "Super coupe",
            },
            {
                name: "Coupe du roi",
            },
            {
                name: "UEFA",
            },
            {
                name: "UEL",
            },
            {
                name: "Coupe du monde",
            },
            {
                name: "Nations League",
            },
        ]
    },
];