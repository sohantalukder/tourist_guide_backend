"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("divisions", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            divisionName: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
            },
            divisionCode: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
            },
            geoCode: {
                type: Sequelize.INTEGER(5),
                allowNull: false,
                unique: true,
            },
            isoCode: {
                type: Sequelize.STRING(5),
                allowNull: false,
                unique: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("divisions");
    },
};
