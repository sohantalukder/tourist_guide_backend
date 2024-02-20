import { DataTypes, Model } from "sequelize";
import dbConnection from ".";

export default () => {
    class Division extends Model {}
    Division.init(
        {
            id: DataTypes.NUMBER,
            divisionName: DataTypes.STRING,
            divisionCode: DataTypes.NUMBER,
            geoCode: DataTypes.NUMBER,
            isoCode: DataTypes.STRING,
            createAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize: dbConnection,
            modelName: "division",
            underscored: true,
        }
    );
    return Division;
};
