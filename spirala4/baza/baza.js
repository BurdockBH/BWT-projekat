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
    },
    casId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Cas',
            key: 'id',
        },
    },
    status: Sequelize.STRING
})

const Cas = sequelize.define('Prisustvo', {
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
            model: 'Predmet',
            key: 'id',
        },
    },
})

const Predmet = sequelize.define('Prisustvo', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    naziv: Sequelize.STRING,
    kod: Sequelize.STRING,
})

const student_predmet = sequelize.define('Prisustvo', {
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
    },
    predmetId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Predmet',
            key: 'id',
        },
    },
})

student_predmet.belongsTo(Student, {foreignKey: 'studentId'});
student_predmet.belongsTo(Predmet, {foreignKey: 'predmetId'});
Cas.belongsTo(Predmet, {foreignKey: 'predmetId'})
Prisustvo.belongsTo(Student, {foreignKey: 'studentId'});
Prisustvo.belongsTo(Cas, {foreignKey: 'casId'})
 

function connectTables() {
    sequelize.sync()
        .then(() => {
            console.log('Tables are successfully connected.');
            console.log(student_predmet.findOne({where: {studentId: 1}}));
        })
        .catch(err => {
            console.error('An error occurred while connecting the tables: ', err);
        });
}

connectTables();

module.exports = sequelize;
module.exports = Student;
module.exports = Prisustvo;
module.exports = Cas;
module.exports = Predmet;
module.exports = student_predmet;
