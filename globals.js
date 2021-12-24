const execSync = require('child_process').execSync;
const fs = require('fs');
const chalk = require("chalk");

const billing = [
  'billing-service'
];

const selection = [
  'selection-engine-service'
];

const others = [
  'web-app',
  'api-gateway',
  'service-order-service',
  'report-service',
  'partner-service',
  'order-service',
  'notification-service',
  'auth-service'
];

async function dropServices(type, services) {
  const kebectlGetPo = execSync(`kubectl get po`, { encoding: 'utf-8' })
  const splitedLines = kebectlGetPo.split('\n');
  
  let cleanedArray = [];
  for await (const line of splitedLines) {
    const splitedLine = line.split(' ');
    const lineValues = splitedLine.filter(el => el !== '');
    cleanedArray.push(lineValues);
  }
  cleanedArray.shift();
  cleanedArray.pop();

  let servicesToDrop = [];
  for await (const service of services) {
    servicesToDrop = servicesToDrop.concat(cleanedArray.filter(el =>
      el[0].includes(service)
    ))
  }

  const date = await getDate();

  let newLogLine = `${type} - Dia: ${date}\r\n`;

  for await (const line of servicesToDrop) {
    console.log(line[0]);
    const kebectlDeletePo = execSync(`kubectl delete po ${line[0]}`, { encoding: 'utf-8' })
    console.log(kebectlDeletePo);
    newLogLine += `${line[0]}  -  ${kebectlDeletePo}\r\n`
  }

  console.log(chalk.bgBlue.black("Finalizado!"));
  newLogLine += '\r\n';

  fs.appendFileSync('logs.txt', newLogLine, (err) => {
    console.log(err);
  });
}

async function getDate() {
  var d = new Date,
  dformat = [
    d.getDate(),
    d.getMonth()+1,
    d.getFullYear()].join('/')+' '+
   [d.getHours(),
    d.getMinutes(),
    d.getSeconds()].join(':');

  return dformat;
}

module.exports = {
  dropServices,
  billing,
  selection,
  others
}