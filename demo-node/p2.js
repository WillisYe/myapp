const fs = require('fs');

const foo = new Promise((resolve, reject) => {
    fs.readFile('foo1.txt', function (err, result) {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    });
});

const result = Promise.resolve(foo);

result.then(data => console.log(data))
    .catch(err => console.log(err))