const bcrypt = require('bcryptjs');
const inquirer = require('inquirer');
const { v4 } = require('uuid');
const chalk = require('chalk');

const model = require('../../models');
const { updateUser } = require('../../controllers/dao/db/user');


const initAdminAndSave = async (adminAccount) => {
  const data = await model.User.create(adminAccount);
  const userId = v4();
  await updateUser({ email: data.dataValues.email }, { userId });

  const log = chalk.green('[✔] Super admin created successfully');
  console.log(log);
  return data;
};

const seedAdmin = async () => {

  let adminFromCommandLine = process.argv[2];
  if (adminFromCommandLine)[, adminFromCommandLine] = adminFromCommandLine.split('=');
  let logInit = chalk.yellowBright('[!] Initializing app...');
  console.log(logInit);

  // eslint-disable-next-line consistent-return

  const rolesExists = await model.User.findOne({ where: { roleId: 'ROL-ADMIN' } });
  if (rolesExists) {
    logInit = chalk.green('[✔] Super admin already initialized');
    console.log(logInit);
  } 
  else {
    await model.sequelize.drop();
    await model.sequelize.sync();
    const rolesCreated = await model.Role.bulkCreate([
      { roleName: 'admin', roleId: 'ROL-ADMIN' },
      { roleName: 'elite', roleId: 'ROL-ELITE' },
    ]);

    if (rolesCreated && adminFromCommandLine !== 'false') {
      inquirer
      .prompt([
        {
          name: 'firstName',
          message: 'First Name (default: admin)',
          default: 'admin',
        },
        {
          name: 'lastName',
          message: 'Last Name (default: admin)',
          default: 'admin',
        },
        {
          name: 'email',
          message: 'email (default: email@example.com)',
          default: 'email@example.com',
        },
      ])
      .then(async (answers) => {
        // hash password
        const salt = bcrypt.genSaltSync(10);
        const userId = v4();

        // eslint-disable-next-line no-param-reassign
        answers.password = await bcrypt.hashSync('01234Admin', salt);
        const superAdminAccount = {
          firstName: answers.firstName,
          lastName: answers.lastName,
          email: answers.email,
          password: answers.password,
          userId,
          roleId: 'ROL-ADMIN',
          status: '1',
          walletId: 'admin-wallet'
        };
        await initAdminAndSave(superAdminAccount);
      });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const userId = v4();

      // eslint-disable-next-line no-param-reassign
      const password = await bcrypt.hashSync('01234Admin', salt);
      const superAdminAccount = {
        firstName: 'admin',
        lastName: 'admin',
        email: process.env.EXCHANGE_FROM_EMAIL,
        password,
        userId,
        roleId: 'ROL-ADMIN',
        status: '1',
      };
      await initAdminAndSave(superAdminAccount);
    }
  }
};

module.exports.seedAdmin = seedAdmin;
