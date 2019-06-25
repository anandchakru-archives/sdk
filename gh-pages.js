const fs = require('fs-extra');
const sh = require('kool-shell');

(async function build() {
  let currentBranch = 'master';
  sh.silentExec('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: process.cwd() }).then((res) => {
    currentBranch = res.stdout.trim();
    sh.info('currentBranch:' + currentBranch);
    commits(currentBranch);
  }).catch((e) => {
    sh.error('Could not find current branch, defaulting to ' + currentBranch);
  });

  async function commits(currentBranch) {
    await sh.silentExec('git', ['status', '--porcelain'], { cwd: process.cwd() }).then((res) => {
      if (res.stderr || res.stderr.trim() !== '' || res.stdout.trim() !== '') {
        sh.error('Uncommitted git changes! Deploy failed.')
      } else {
        deploy(currentBranch);
      }
    }).catch((e) => {
      sh.error('Error: git status --porcelain' + e);
      back2Branch(currentBranch);
    });
  }
  async function deploy(currentBranch) {
    await fs.remove('../.tmpghpage');
    await fs.ensureDir('../.tmpghpage');
    await fs.ensureDir('./dist/elements');
    fs.copy('dist', '../.tmpghpage');
    await sh.silentExec('git', ['show-ref', '--verify', 'refs/heads/gh-pages'], { cwd: process.cwd() }).then(() => {
      sh.debug('found existing gh-pages branch.');
      sh.silentExec('git', ['checkout', 'gh-pages'], { cwd: process.cwd() }).catch((e) => { sh.info(e); });
    }).catch((e) => {
      sh.debug('creating new gh-pages branch.');
      sh.silentExec('git', ['checkout', '-b', 'gh-pages'], { cwd: process.cwd() }).catch((e) => { sh.info(e); });
    });
    await fs.copy('../.tmpghpage', 'dist');
    await sh.silentExec('git', ['add', '-A'], { cwd: process.cwd() }).then(() => {
      sh.debug('added.');
      sh.silentExec('git', ['commit', '-m', ':package: Update gh-pages', '--no-verify'], { cwd: process.cwd() }).then(() => {
        sh.silentExec('git', ['push', 'origin', 'gh-pages', '--force'], { cwd: process.cwd() }).then(() => {
          fs.remove('../.tmpghpage');
          back2Branch(currentBranch);
        }).catch((e) => { sh.info(e); back2Branch(currentBranch); });
      }).then(() => { sh.debug('commited.'); }).catch((e) => { sh.info(e); back2Branch(currentBranch); });
    }).then(() => { sh.debug('pushed.'); }).catch((e) => { sh.info(e); back2Branch(currentBranch); });
  }
  function back2Branch(currentBranch) {
    sh.silentExec('git', ['checkout', currentBranch], { cwd: process.cwd() }).then(() => { sh.info('back to ' + currentBranch); })
      .catch((e) => { sh.error('Failed to checkout ' + currentBranch); })
  }
})()