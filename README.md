# GPFS Migration Tool UI

Migration tool UI is based off of ReactJS library. UI component provides following functionality:

* Provide password based authentication to Azure AD users
* Allow users to archive files from their home directories (on GPFS) to ADLS
* Allow users to restore files from ADLS to their home directories (on GPFS), at original locations
* Allow Data Administrators to archive files for users they manage from GPFS to ADLS
* Allow Data Administrators to restore files for users they manage from ADLS to GPFS, at original locations

## Build this project using Docker

At the root folder of project execute this command:

`docker build -f docker/Dockerfile -t phxdecideacrdev.azurecr.io/gpfs-archiver-ui:<version> .`

Docker container has one nginx http server running as a non root user.

## Environment Variables

|Environment | Description | Default Value |
|----|----|----|
|REACT_APP_API_BASE_URL | Backend API Base Url | http://localhost:8080 |
|REACT_APP_BASE_URL | Frontend Base Url | https://localhost |
|REACT_APP_OAUTH_URL | OAuth Server URL| OAuth Authentication URL. Typically https://login.microsoftonline.com/<tenant ID> |
|REACT_APP_OAUTH_CLIENT_ID | OAuth Client ID, Get this from App Registration  |  |
|REACT_APP_OAUTH_REDIRECT_URI | Configured URI for the Client ID | This is done as part of App Registration |

## Development Setup

### Prerequisites
- Yarn
- Code Editor of your preference

1. Clone this project
1. Add to your /etc/hosts file this line
```
127.0.0.1 archive.phoenixdev.optumlabs.com
```
1. Clone and run the [Migration UI Project](https://github.optum.com/NHI-Cloud/gpfs-migration-svc)
```
git clone https://github.optum.com/NHI-Cloud/gpfs-migration-svc
```
1. Install react dependencies
```
yarn install
```
1. Run the project using this command
```
sudo yarn start
```
1. [Click here](https://archive.phoenixdev.optumlabs.com) to access the project url and accept the self-signed certificate

## Production Setup

We have built a Jenkins job that pulls the code from git, builds it using gradle, pushes the image to Artifactory and ACR and finally deploys it in Kubernetes. Refer to the [deployment](k8s/deployments/migration-ui-app.yaml) for details. We have also provided Ingress deployment in Migration Microservice project that would need to run to accept traffic from internet for the Application to work for end users.


