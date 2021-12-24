var cron = require('node-cron');
const execSync = require('child_process').execSync;

const globals = require('./globals');

console.log(execSync(`npx cowsay "SERVIÇO INICIALIZADO!" -y`, { encoding: 'utf-8' }));
const kebectlGetPo = execSync(`kubectl get po`, { encoding: 'utf-8' })
console.log(kebectlGetPo);

cron.schedule('45 6 * * *', async () => {
  const output = execSync(`npx cowsay -d "DERRUBANDO SERVIÇOS DO MSE" -y`, { encoding: 'utf-8' })
  console.log(output);

  const all = globals.others.concat(globals.selection, globals.billing);
  await globals.dropServices('Cron', all);

}, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
});