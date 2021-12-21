var cron = require('node-cron');
const fs = require('fs');
const execSync = require('child_process').execSync;

console.log(execSync(`npx cowsay "SERVIÇO INICIALIZADO!" -y`, { encoding: 'utf-8' }));

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

cron.schedule('30 7 * * *', async () => {
  const output = execSync(`npx cowsay -d "DERRUBANDO SERVIÇOS DO MSE" -y`, { encoding: 'utf-8' })
  console.log(output);

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

  // filter services to drop
  const servicesToDrop = cleanedArray.filter(el =>
    el[0].includes('selection-engine-service') ||
    el[0].includes('web-app')
  );

  const date = await getDate();

  let newLogLine = `Dia: ${date}\r\n`;

  for await (const line of servicesToDrop) {
    // console.log(line[0]);
    // const kebectlDeletePo = execSync(`kubectl delete po ${line[0]}`, { encoding: 'utf-8' })
    // console.log(kebectlDeletePo);
    // newLogLine += `${line[0]}  -  ${kebectlDeletePo}\r\n`
  }
  newLogLine += '\r\n';

  fs.appendFileSync('logs.txt', newLogLine, (err) => {
    console.log(err);
  });
}, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
});