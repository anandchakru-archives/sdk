const fs = require('fs-extra');

(async function build() {

  await fs.remove('./dist/elements');
  await fs.ensureDir('./dist/sdk');
  await fs.ensureDir('./dist/elements');

  // For publishing to npm
  await fs.copySync('./dist/sdk', './dist/elements', {
    overwrite: true, filter: (src, dst) => {
      const matches = src.match(/(.dist\/sdk)|(dist\/sdk\/.*(css|js))/);  // https://regex101.com/r/k1jI5l/1
      return matches && matches.length;
    }
  });
  await fs.copy('./src/styles.scss', './dist/elements/styles.scss', { overwrite: true });
  await fs.copy('./src/sample.json', './dist/elements/sample.json', { overwrite: true });

  await fs.remove('./dist/elements/assets');
  await fs.remove('./dist/elements/index.html');

})()
