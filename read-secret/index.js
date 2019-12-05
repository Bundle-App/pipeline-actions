const config = require('../config');
const {sendHttpRequest} = require('../lib');

const core = require('@actions/core');

const INPUT_KEY_NAME = 'name';
const INPUT_KEY_REPO = 'repository';
const INPUT_KEY_AUTH_TOKEN = 'token';
const INPUT_KEY_IGNORE_FAILURE = 'ignore-failure';

// most @actions toolkit packages have async methods
async function run() {
  try {
    const name = core.getInput(INPUT_KEY_NAME);
    const repository = core.getInput(INPUT_KEY_REPO);
    const token = core.getInput(INPUT_KEY_AUTH_TOKEN) || process.env.GITHUB_TOKEN;
    if (!token) {
      return core.setFailed("token was not set and not present in env GITHUB_TOKEN");
    }
    
    const ignoreFailure = core.getInput(INPUT_KEY_IGNORE_FAILURE) === 'true';
    const currentRepo = process.env.GITHUB_REPOSITORY;

    console.log(`:: Reading key: ${name} from repository: ${repository}, current repo: ${currentRepo}`);
    const data = {repository, name, action: 'get'};

    const response = await sendHttpRequest(config.secretStoreUrl, 'POST', JSON.stringify(data), {
      'x-github-repository': currentRepo,
      'x-github-token': token,
      'content-type': 'application/json'
    });


    if (response.statusCode !== 200) {
      if (ignoreFailure) {
        console.log('::Error:: ', response.statusCode, '=>', response.data);
        core.setOutput('value', '');
      } else {
        core.setFailed(JSON.parse(response.data));
      }
    } else {
      core.setOutput('value', JSON.parse(response.data));
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();