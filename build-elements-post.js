const replace = require('replace-in-file');

replace.sync({
  files: [
    'src/index.html'
  ],
  from: '  <!--<nivite-sdk-root></nivite-sdk-root>-->',
  to: '  <nivite-sdk-root></nivite-sdk-root>'
});
replace.sync({
  files: [
    'src/app/app.module.ts'
  ],
  from: 'bootstrap: [/*AppComponent*/]',
  to: 'bootstrap: [AppComponent]'
});