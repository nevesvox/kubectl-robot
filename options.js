const inquirer = require("inquirer");
const chalk = require("chalk");

const globals = require('./globals');

operation();

async function operation() {
  try {
    const result = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'MSE - Selecione as opções:',
      choices: [
        '1 - Derrubar serviços de geração de Extratos (Procedimento corte)',
        '2 - Derrubar serviços de atribuição de parceiros',
        '3 - Derrubar todos os serviços',
        '4 - Sair'
      ]
    }]);

    const { action } = result;

    if (action.includes('1')) {
      await billingService(action);
    } else if (action.includes('2')) {
      await selectionService(action);
    } else if (action.includes('3')) {
      await allServices(action);
    } else if (action.includes('4')) {
      console.log(chalk.bgBlue.black("Sistema finalizado"));
      process.exit();
    }

  } catch (err) {
    console.log(err);
  }
}

async function billingService(action) {
  console.log(chalk.bgBlue.black("Derrubando serviços de extrato"));
  await globals.dropServices(action, globals.billing);
  await operation();
}

async function selectionService(action) {
  console.log(chalk.bgBlue.black("Derrubando serviços de seleção de parceiros"));
  await globals.dropServices(action, globals.selection);
  await operation();
}

async function allServices(action) {
  console.log(chalk.bgBlue.black("Derrubando todos os serviços"));
  const all = globals.others.concat(globals.selection, globals.billing);
  await globals.dropServices(action, all);
  await operation();
}