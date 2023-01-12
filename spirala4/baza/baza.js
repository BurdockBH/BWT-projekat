const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    "deasgnpp",
    "deasgnpp",
    "4y0AsaKzW_BN61TmFhL84YOOx4yS76ZG",
    {
        host: "snuffleupagus.db.elephantsql.com",
        dialect: "postgres",
    }
);

module.exports = sequelize;
