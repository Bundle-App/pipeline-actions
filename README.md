
<p align="center">
  <a href="https://github.com/bundle-app/pipeline-actions">
  <img alt="GitHub Actions status" src="https://github.com/bundle-app/pipeline-actions/workflows/test-local/badge.svg">
  </a> 
</p>

# Bundle Pipeline Actions

This is a collection of scripts that we use internally as part of our build pipeline. Many of these scripts are very specific to our use case, but can be modified to fit yours.


# Actions

## Secret Sharing

The secret sharing scripts allow various repositories to share their keys with each others. Repositories can publish their secret keys to a secure store using the `write-secret` action, while other repositories can read the secrets using the  `read-secret` action. 

Please note that these scripts are only accessible to private repositories. This is to ensure that the reader has been granted access to our organization. Also note that the repository requesting a secret must be within the same organization.

### Write Secret
This script allows you to store a github secret securely, and makes it accessible to other repositories within the organization.

#### Parameters

* name (required): specifies the name of the secret to write
* value (required): the value of the secret.
* ignore-failure (optional): do not exit with failure if writing fails, defaults to false.
* token (optional): the repository token to use when accessing the secret store service. Defaults to `GITHUB_TOKEN` environment variable if available.

#### Usage Example

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: bundle-app/pipeline-actions/write-secret@master
        name: Write Secret
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
        with:
          name: random-key
          value: test-value
```

### Read Secret
This script allows you to read a github secret written by same or another repository securely.

#### Parameters

* name (required): specifies the name of the secret to write
* repository (required): the repository that published the secret.
* ignore-failure (optional): do not exit with failure if reading fails, defaults to false.
* token (optional): the repository token to use when accessing the secret store service. Defaults to `GITHUB_TOKEN` environment variable if available.

#### Usage Example

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: bundle-app/pipeline-actions/read-secret@master
        name: Read Secret
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
        with:
          name: random-key
          repository: api-specs
          ignore-failure: true
```

