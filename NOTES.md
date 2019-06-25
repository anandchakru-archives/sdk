NOTE:

When building nivite-wrap component, comment 
1. `<nivite-sdk-root></nivite-sdk-root>` in index.html 
2. `bootstrap: [/*AppComponent*/]` in app.module.ts
and hit http://localhost:4300/assets/test.html


When testing uncomment them and hit http://localhost:4300


References:

https://medium.com/@balramchavan/building-simple-custom-web-element-using-angular-v6-element-667b5f02c138

https://angular.io/guide/elements

https://blog.bitsrc.io/using-angular-elements-why-and-how-part-1-35f7fd4f0457

https://blog.bitsrc.io/using-angular-elements-why-and-how-part-2-37d52e71b4f9

https://github.com/alcfeoh/ng2-training/tree/master/projects/elements

https://stackoverflow.com/a/901144/234110 - plain js queryparam


```sh
ng new sdk --style scss --prefix nivite-sdk
ng add @angular/elements --name=@nivite/sdk
npm i @angular/elements bootstrap jquery popper 

```