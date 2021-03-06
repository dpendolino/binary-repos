#!/usr/bin/env node

/*
Source: https://hiddentao.com/archives/2016/08/29/triggering-travis-ci-build-from-another-projects-build/
 */

"use strict";

const shell = require('shelljs'),
  path = require('path'),
  got = require('got');


console.log(`Fetching Git commit hash...`);

const gitCommitRet = shell.exec('git rev-parse HEAD', {
  cwd: __dirname
});

if (0 !== gitCommitRet.code) {
  console.error('Error getting git commit hash');

  process.exit(-1);
}

const gitCommitHash = gitCommitRet.stdout.trim();

console.log(`Git commit: ${gitCommitHash}`);

console.log('Calling Travis...');


got.post(`https://api.travis-ci.org/repo/dpendolino%2Fdarch-recipes/requests`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Travis-API-Version": "3",
      "Authorization": `token ${process.env.TRAVIS_API_TOKEN}`,
    },
    body: JSON.stringify({
      request: {
        message: `Trigger build at dpendolino/darch-recipes commit: ${gitCommitHash}`,
        branch: 'develop',
      },
    }),
  })
  .then(() => {
    console.log("Triggered build of dpendolino/darch-recipes");
  })
  .catch((err) => {
    console.error(err);

    process.exit(-1);
  });