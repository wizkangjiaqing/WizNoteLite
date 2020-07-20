const url = require('url');

let content = `![aaaaaaa.png](/img/bVbJU60)`;
let start = content.indexOf('(');
let end = content.indexOf(')');
console.log(content.slice(start + 1, end));
