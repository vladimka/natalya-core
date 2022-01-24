const { Brains } = require('../dist/index');
const path = require('path');
const natalya = new Brains(path.join(__dirname, 'sinonims.json'), path.join(__dirname, 'answers.json'));
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