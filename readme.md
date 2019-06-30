# Nivite SDK
Use this SDK to create your own invite and interact with [Nivite](nivite.com)

Sample at https://github.com/nivite/example1.git

# How to

# Ng8
Demonstrates the use of [@nivite/sdk](https://github.com/nivite/sdk)

For a quick demo, go to [gh-pages](http://anandchakru.github.io/nivite/example1)

## How to
1. Things you'll require:
    1. [VS Code](https://code.visualstudio.com/) to edit your code.
    2. An account in [github](https://github.com/join) to host. Example username **GHUSERNAME**.
    3. [Git](https://www.linode.com/docs/development/version-control/how-to-install-git-on-linux-mac-and-windows/) to upload your code to a repo.
    4. An invite created at [nIvite](nivite.com) - you will get invite.oid. Example: `1807175406407`
    5. [Curiosity!](https://www.merriam-webster.com/dictionary/curiosity) :)
2. Or if you want to create your invite from scratch:
```sh
mkdir invite
cd invite
git init
mkdir src dist
cd src
touch index.html
touch mystyle.css
touch index.js
#open it in your favourite text editor
code .
```
3. Add basic content into *index.html*
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>nIvite</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <link rel="stylesheet" href="https://nivite.github.io/sdk/style.css">
  <link rel="stylesheet" href="mystyle.css">
</head>
<body class="bg-dark text-light">
  <!-- required, used for nivite nav-bar, alerts, calendar modal & rsvp modal -->
  <div id="nivite">
  </div>
  <!-- optional, if present invite details will be populated into this automatically -->
  <!-- <div id="invite"></div> -->
  <div class="container text-center">
    <div id="shortMsg" class="display-2"></div>
    <div id="title" class="display-4"></div>
    <div id="vitals" class="row fixed-bottom justify-content-center bg-dark text-light p-sm-4 p-3">
      <div id="addr" class="col-12 col-sm-6 text-left">
        <div id="addrHeading" class="font-weight-bolder text-warning">Venue</div>
        <div id="addrName"></div>
        <div id="addrText"></div>
      </div>
      <div id="time" class="col-12 col-sm-6 text-left text-sm-right">
        <div id="timeHeading" class="font-weight-bolder text-warning">Time</div>
        <div id="timeFrom"></div>
        <div id="timeTo"></div>
      </div>
    </div>
    <div id="photos" class="m-4"></div>
    <div id="longMsg"></div>
  </div>
  <script src="index.js"></script>
  <script src="https://nivite.github.io/sdk/main.js"></script>
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
  <script src="https://kit.fontawesome.com/356ba2cc78.js" integrity="sha384-IwFbZvLB3nqmwJikzn6JZAqNDTwjFfauT4djixzjaxmR030Fd2gx05kWWwBLwRYZ" crossorigin="anonymous"></script>
</body>
</html>
```
4. Add basic content into *index.js*
```js
document.addEventListener('niviteLoaded', (event) => {
  dated = (input, from) => {
    if (input) {
      const t = new Date(input);
      if (from) {
        const f = new Date(from);
        if (f.getDate() === t.getDate()
          && f.getMonth() === t.getMonth()) {
          return ' - to - ' + t.toLocaleTimeString();
        }
      }
      return t.toLocaleString();
    }
  }
  img = (pIndx) => {
    const photo = invite.photos[pIndx];
    return '<img id="photo' + (pIndx) + '" src="' + photo.url + '" title="' + photo.title + '" class="img-fluid rounded shadow-lg' + (pIndx === 0 ? '' : 'd-none') + '" alt="' + (photo.description ? photo.description : photo.title) + '" data-tags="' + photo.tags + '">';
  }

  const invite = event.detail;
  $('#title').html(invite.title);
  $('#shortMsg').html(invite.shortMsg);
  $('#longMsg').html(invite.longMsg);
  $('#addrName').html(invite.addrName);
  $('#addrText').html(invite.addrText);
  $('#timeFrom').html(dated(invite.timeFrom));
  $('#timeTo').html(dated(invite.timeTo, invite.timeFrom));
  if (invite.photos) {
    $('#photos').append(img(0));
  }
});
```

5. And some content in *mystyle.css*
```css
@import url("https://fonts.googleapis.com/css?family=Tangerine|Barriecito|Righteous|Fredoka+One&display=swap");

body {
  height: 100%;
  padding-bottom: 150px;
}

.pointer {
  cursor: pointer;
}

@media (max-width: 575.98px) {
  body {
    padding-bottom: 220px;
  }

  .display-1 {
    font-size: 3rem;
    font-weight: 300;
    line-height: 1.0;
  }

  .display-2 {
    font-size: 2.75rem;
    font-weight: 300;
    line-height: 1.0;
  }

  .display-3 {
    font-size: 2.25rem;
    font-weight: 300;
    line-height: 1.0;
  }

  .display-4 {
    font-size: 1.75rem;
    font-weight: 300;
    line-height: 1.0;
  }
}

#vitals {
  max-height: 200px;
}

#shortMsg {
  text-shadow: 3px 3px 10px #1f8c5a;
  font-family: Tangerine, Georgia, serif;
  animation: glow 1s ease-in-out infinite alternate;
}

#title {
  text-shadow: 3px 3px 10px #1f8c5a;
  font-family: Barriecito, Georgia, serif;
}

#longMsg {
  font-family: 'Fredoka One', Georgia, serif;
}
```
6. Create a new repository in github.com, example [invite](https://github.com/GHUSERNAME/invite.git)
7. Time to commit the changes & publish to github.com
```sh
git add .
git commit -m "First Commit"
git remote add origin https://github.com/GHUSERNAME/invite.git
git push -u origin master
```
8. Go to `https://github.com/GHUSERNAME/invite` and ensure you have `src` dir listed.
9. Publish the `dist` dir.
```sh
cd invite
cp ./src/* ./dist/
git add . && git commit -m "dist subtree commit"
git subtree push --prefix dist origin gh-pages
```
10. Validate that its published by visiting `https://GHUSERNAME.github.io/invite` The site might not look complete.
11. Validate with sample.json by appending `?sj=1` to the url. Example: `https://GHUSERNAME.github.io/invite/?sj=1`
12. Validate with real date by appending &iOid=1807175406407 (the invite.oid from nivite.com) to the url. Example: `https://GHUSERNAME.github.io/invite/?iOid=1807175406407`
13. If you want to personalize and send each guest's invitation, go back to [nIvite](https://nivite.com) and follow the remaining steps. If not, feel free to share your invitation in facebook/twitter/whatsapp/email/text - where ever your guests are reachable.

**NOTE**: You can *fork* one of our [templates](https://github.com/nivite?q=template). For help see [how to fork](https://help.github.com/en/articles/fork-a-repo#fork-an-example-repository).


#### References

[webpack, typescript, scss](https://hackernoon.com/lets-start-with-webpack-4-91a0f1dba02e)

[boilerplate](https://github.com/thejsdeveloper/webpack4-setup)