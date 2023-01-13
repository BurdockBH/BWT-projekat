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

const Student = sequelize.define('Student', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ime: Sequelize.STRING,
    prezime: Sequelize.STRING,
    index: Sequelize.STRING
})


const Predmet = sequelize.define('Predmet', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    naziv: Sequelize.STRING,
    kod: Sequelize.STRING,
})

const Cas = sequelize.define('Cas', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    redniBroj: Sequelize.STRING,
    tip: Sequelize.STRING,
    sedmica: Sequelize.STRING,
    predmetId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Predmets',
            key: 'id',
        },
    },
})


const student_predmet = sequelize.define('student_predmet', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    studentId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Students',
            key: 'id',
        },
    },
    predmetId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Predmets',
            key: 'id',
        },
    },
})

const Prisustvo = sequelize.define('Prisustvo', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    studentId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Students',
            key: 'id',
        },
    },
    casId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Cass',
            key: 'id',
        },
    },
    status: Sequelize.STRING
})
 
student_predmet.belongsTo(Student, {foreignKey: 'studentId'});
student_predmet.belongsTo(Predmet, {foreignKey: 'predmetId'});
Cas.belongsTo(Predmet, {foreignKey: 'predmetId'})
Prisustvo.belongsTo(Student, {foreignKey: 'studentId'});
Prisustvo.belongsTo(Cas, {foreignKey: 'casId'})

sequelize.sync()
    .then(() => console.log('Tables created successfully'))
    .catch(err => console.error('Error creating tables:', err));

module.exports = {sequelize, Student, Prisustvo, Predmet, student_predmet};

