const config = require('../config');
const {sendHttpRequest} = require('../lib');

const core = require('@actions/core');

const INPUT_KEY_NAME = 'name';
const INPUT_KEY_VALUE = 'value';
const INPUT_KEY_AUTH_TOKEN = 'token';
const INPUT_KEY_IGNORE_FAILURE = 'ignore-failure';

// most @actions toolkit packages have async methods
async function run() {
  try {
    const name = core.getInput(INPUT_KEY_NAME);
    const value = core.getInput(INPUT_KEY_VALUE);
    const token = core.getInput(INPUT_KEY_AUTH_TOKEN) || process.env.GITHUB_TOKEN;
    if (!token) {
      return core.setFailed("token was not set and not present in env GITHUB_TOKEN");
    }

    const ignoreFailure = core.getInput(INPUT_KEY_IGNORE_FAILURE) === 'true';
    const currentRepo = process.env.GITHUB_REPOSITORY;


    console.log(`:: Writing key: ${name} for repository: ${currentRepo}`);
    const data = {value, name, action: 'set'};

    const response = await sendHttpRequest(config.secretStoreUrl, 'POST', JSON.stringify(data), {
      'x-github-repository': currentRepo,
      'x-github-token': token,
      'content-type': 'application/json'
    });

    if (response.statusCode !== 201) {
      if (ignoreFailure) {
        console.log('::Error:: ', response.statusCode, '=>', response.data);
        core.setOutput('status', `${response.statusCode}`);
      } else {
        core.setFailed(response.data ? JSON.parse(response.data) : `Status Code = ${response.statusCode}`);
      }
    } else {
      core.setOutput('status', `${response.statusCode}`);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
