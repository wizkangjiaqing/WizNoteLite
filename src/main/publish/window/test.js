const url = require('url');

let content = `![9518564f-a84c-4a4c-b2aa-84eed5b88594.png](https://upload-images.jianshu.io/upload_images/1616871-ed68d74fb3cde189.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)`;
let start = content.indexOf('https:');
let end = content.indexOf('?');
console.log(content.slice(start, end));
