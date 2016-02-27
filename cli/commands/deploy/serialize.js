const fs = require('fs');
const path = require('path');

module.exports = function serializeSync(dir, root) {
  return fs.readdirSync(path.resolve(__dirname, dir))
    .map(file => path.resolve(__dirname, dir, file))
    .map(file => ({ dir: file, isDirectory: fs.statSync(file).isDirectory() }))
    .reduce((prevObj, currObj) => {
      if (currObj.isDirectory) {
        return Object.assign(prevObj, serializeSync(currObj.dir, root || dir));
      }
      return Object.assign(prevObj, {
        [new Buffer(
          path.relative(path.resolve(root || dir, '..'), currObj.dir)
        ).toString('base64')]: new Buffer(
          fs.readFileSync(currObj.dir, 'utf-8')
        ).toString('base64'),
      });
    }, {});
};
