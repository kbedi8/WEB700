// modules/legoSets.js

require('dotenv').config();
const Sequelize = require('sequelize');

class LegoData {
    constructor() {
        // 1. Initialize Sequelize
        this.sequelize = new Sequelize(
            process.env.PGDATABASE,
            process.env.PGUSER,
            process.env.PGPASSWORD,
            {
                host: process.env.PGHOST,
                dialect: 'postgres',
                dialectOptions: {
                    ssl: { require: true, rejectUnauthorized: false }
                }
            }
        );

        // 2. Define Theme model
        this.Theme = this.sequelize.define(
            'Theme',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: Sequelize.STRING
            },
            {
                createdAt: false,
                updatedAt: false
            }
        );

        // 3. Define Set model
        this.Set = this.sequelize.define(
            'Set',
            {
                set_num: {
                    type: Sequelize.STRING,
                    primaryKey: true
                },
                name: Sequelize.STRING,
                year: Sequelize.INTEGER,
                num_parts: Sequelize.INTEGER,
                theme_id: Sequelize.INTEGER,
                img_url: Sequelize.STRING
            },
            {
                createdAt: false,
                updatedAt: false
            }
        );

        // 4. Set → Theme relationship
        this.Set.belongsTo(this.Theme, { foreignKey: 'theme_id' });
    }

    // Initialize database
    initialize() {
        return this.sequelize.sync();
    }

    // ------------- SET OPERATIONS ----------------

    getAllSets() {
        return this.Set.findAll({ include: [this.Theme] });
    }

    getSetByNum(setNum) {
        return this.Set.findOne({
            include: [this.Theme],
            where: { set_num: setNum }
        }).then(set => {
            if (set) return set;
            throw "Unable to find requested set";
        });
    }

    getSetsByTheme(theme) {
        return this.Set.findAll({
            include: [this.Theme],
            where: {
                '$Theme.name$': { [Sequelize.Op.iLike]: `%${theme}%` }
            }
        }).then(sets => {
            if (sets.length > 0) return sets;
            throw "Unable to find requested sets";
        });
    }

    addSet(newSet) {
        return this.Set.create(newSet)
            .then(() => {
                // Success: resolve nothing
            })
            .catch(err => {
                // Return human-readable message
                if (err.errors && err.errors.length > 0) {
                    throw err.errors[0].message;
                } else {
                    throw "Error adding new set";
                }
            });
    }

 deleteSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        this.Set.destroy({ where: { set_num: setNum } })
            .then(count => {
                if (count === 0) {
                    // No rows deleted → set not found
                    reject("Unable to find set to delete");
                } else {
                    // Successfully deleted → resolve nothing
                    resolve();
                }
            })
            .catch(err => {
                // If Sequelize returns validation errors
                if (err.errors && err.errors.length > 0) {
                    reject(err.errors[0].message);
                } else {
                    reject("Error deleting the set");
                }
            });
    });
}



    // ------------- THEME OPERATIONS ----------------

    getAllThemes() {
        return this.Theme.findAll()
            .then(themes => {
                if (themes.length > 0) return themes;
                throw "No themes available";
            });
    }

    // Removed getThemeById() since no longer needed
}

module.exports = LegoData;
