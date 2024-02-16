import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    class Division extends Model {}
    Division.init(
        {
            id: dataTypes.NUMBER,
            divisionName: dataTypes.STRING,
            divisionCode: dataTypes.NUMBER,
            geoCode: dataTypes.NUMBER,
            isoCode: dataTypes.STRING,
            createAt: dataTypes.DATE,
            updatedAt: dataTypes.DATE,
        },
        {
            sequelize,
            modelName: "division",
            underscored: true,
        }
    );
    return Division;
};
