# natalya-core
Natalya Voice assistants core

### Installation

```shell
npm i natalya-core
```

### Usage

Create an index.js file and write in it:

```js
const { Natalya } = require('../dist/index');

const sinonims = {
    hi : ["привет"]
};
const answers = {
    ".*hi.*" : ["Привет", "Здравствуйте"]
};
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
```

Run it with the `node index.js` command and write in the console.

You can also run this example with `node ./node_modules/natalya-core/examples/index.js`