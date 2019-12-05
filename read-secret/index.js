const config = require('../config');
const {sendHttpRequest} = require('../lib');

const core = require('@actions/core');

const INPUT_KEY_NAME = 'name';
const INPUT_KEY_REPO = 'repository';
const INPUT_KEY_AUTH_TOKEN = 'token';
const INPUT_KEY_CURRENT_REPO = 'current-repo';

// most @actions toolkit packages have async methods
async function run() {
  try {
    const name = core.getInput(INPUT_KEY_NAME);
    const repository = core.getInput(INPUT_KEY_REPO);
    const token = core.getInput(INPUT_KEY_AUTH_TOKEN) || process.env.GITHUB_TOKEN;
    const currentRepo = core.getInput(INPUT_KEY_CURRENT_REPO) || process.env.GITHUB_REPOSITORY;

    core.debug(`Reading key: ${name} from repository: ${repository}, current repo: ${currentRepo}`);
    const data = {repository, name, action: 'get'};

    const response = await sendHttpRequest(config.secretStoreUrl, 'POST', JSON.stringify(data), {
      'x-github-repository': currentRepo,
      'x-github-token': token
    });

    if (response.statusCode !== 200) {
      core.setFailed(JSON.parse(response.data));
    } else {
      core.setOutput('value', JSON.parse(response.data));
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();