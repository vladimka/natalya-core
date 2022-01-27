const { Natalya } = require('../dist/index');

const sinonims = require('./sinonims.json');
const answers = require('./answers.json');
const natalya = new Natalya({ sinonims, answers });
const sid = 1;

natalya.addSession(sid);

process.stdin.setEncoding('utf-8');
process.stdin.on('data', data => {
    let text = data.trim();

    if(text == '')
        return;

    text = text.toLowerCase().replace(/[,\.?!]+/g, '');
    let answer = natalya.getAnswer({ sid, text });

    console.log(answer);
});

const exitHandler = () => {
    natalya.removeSession(sid);
    process.exit(0);
}

process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);