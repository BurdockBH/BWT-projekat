const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    "lxlswnnc",
    "lxlswnnc",
    "7Xfg4Y_NcQNuI-rqBTyHfpKwWBJPz-Ud",
    {
        host: "hattie.db.elephantsql.com",
        dialect: "postgres",
    }
);


const Student = sequelize.define('Student', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ime: Sequelize.STRING,
    prezime: Sequelize.STRING,
    index: Sequelize.STRING,
}, {tableName: 'Student'})


const Predmet = sequelize.define('Predmet', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    naziv: Sequelize.STRING,
    kod: Sequelize.STRING,
}, {tableName: 'Predmet'})

const Cas = sequelize.define('Cas', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    redniBroj: Sequelize.INTEGER,
    tip: Sequelize.STRING,
    sedmica: Sequelize.INTEGER,
    predmetId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Predmet',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
}, {tableName: 'Cas'})


const student_predmet = sequelize.define('student_predmet', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    studentId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Student',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    predmetId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Predmet',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
}, {tableName: "student_predmet"})

const Prisustvo = sequelize.define('Prisustvo', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    studentId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Student',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    casId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Cas',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    status: Sequelize.STRING
}, {tableName: 'Prisustvo'})

student_predmet.belongsTo(Student, {foreignKey: 'studentId'});
student_predmet.belongsTo(Predmet, {foreignKey: 'predmetId'});
Cas.belongsTo(Predmet, {foreignKey: 'predmetId'})
Prisustvo.belongsTo(Student, {foreignKey: 'studentId'});
Prisustvo.belongsTo(Cas, {foreignKey: 'casId'})

// sequelize.sync()
//     .then(() => console.log('Tables created successfully'))
//     .catch(err => console.error('Error creating tables:', err));

module.exports = {sequelize, Student, Prisustvo, Predmet, student_predmet, Cas};

