const fs = require('fs-extra');
const concat = require('concat');

(async function build() {

  const files_es5 = [
    './dist/sdk/runtime-es5.js',
    './dist/sdk/polyfills-es5.js',
    './dist/sdk/main-es5.js'
  ];

  const files_es2015 = [
    './dist/sdk/runtime-es2015.js',
    './dist/sdk/polyfills-es2015.js',
    './dist/sdk/main-es2015.js'
  ];
  await fs.ensureDir('./dist/sdk');
  await fs.ensureDir('./dist/elements');
  await fs.ensureDir('./dist/elements/test');

  await concat(files_es5, 'dist/sdk/nivite-sdk-es5.js');
  await concat(files_es2015, 'dist/sdk/nivite-sdk-es2015.js');

  // For testing in local
  fs.copy('dist/sdk/nivite-sdk-es5.js', 'src/assets/nivite-sdk-es5.js', { overwrite: true });
  fs.copy('dist/sdk/nivite-sdk-es2015.js', 'src/assets/nivite-sdk-es2015.js', { overwrite: true });
  fs.copy('dist/sdk/styles.css', 'src/assets/styles.css', { overwrite: true });

  // For publishing to npm
  fs.copy('dist/sdk/nivite-sdk-es5.js', 'dist/elements/nivite-sdk-es5.js', { overwrite: true });
  fs.copy('dist/sdk/nivite-sdk-es2015.js', 'dist/elements/nivite-sdk-es2015.js', { overwrite: true });
  fs.copy('dist/sdk/styles.css', 'dist/elements/styles.css', { overwrite: true });
  fs.copy('src/styles.scss', 'dist/elements/scss/styles.scss', { overwrite: true });
  fs.copy('sample.json', 'dist/elements/test/sample.json', { overwrite: true });

})()
