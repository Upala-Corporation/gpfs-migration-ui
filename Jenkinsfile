#!/usr/bin/env groovy
@Library("com.optum.jenkins.pipeline.library@master") _

import org.apache.commons.io.FileUtils
import org.apache.commons.io.filefilter.WildcardFileFilter

def updateVersion() {
  def props = readJSON(file: 'buildProperties.json')
  props['version'] = props['version'] + '.' + env.BUILD_NUMBER
  env.VERSION = props['version']
  writeJSON(file: 'buildProperties.json', json: props, pretty: 4)
}

def initialize() {
  checkout scm
  updateVersion()
}

pipeline {
  agent none

  options {
    disableConcurrentBuilds()
    skipStagesAfterUnstable()
    buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))
    parallelsAlwaysFailFast()
  }

  environment {
    SHARED_MODULES_BRANCH = 'latest'
    ACR_REPO_URL = 'phxdecideacrdev.azurecr.io'
    ARTIFACTORY_URL = 'docker.repo1.uhc.com/nhi-cloud/gpfs-archiver'
    IMAGE_NAME = 'gpfs-archiver-ui'
  }

  stages {
    stage('DEVELOP') {
      agent { label 'docker-maven-slave' }

      stages {
        stage('CleanWorkspace') {
          steps {
            echo 'skipping cleanup'
          }
        }

        stage('Generate Plan') {
          steps {
            initialize()
          }
        }
        stage('Build') {
          steps {
            sh """
              docker build -f docker/Dockerfile -t ${ACR_REPO_URL}/${IMAGE_NAME}:${env.VERSION} .
              docker tag ${ACR_REPO_URL}/${IMAGE_NAME}:${env.VERSION} ${ARTIFACTORY_URL}/${IMAGE_NAME}:${env.VERSION}
              docker tag ${ACR_REPO_URL}/${IMAGE_NAME}:${env.VERSION} ${ACR_REPO_URL}/${IMAGE_NAME}:latest
            """
          }
        }
       stage('Push to Artifactory') {
          steps {
            withCredentials([
              usernamePassword(credentialsId: '180aceb1-7d63-4271-9559-19e22ee1ce78',
                usernameVariable: 'DOCKER_USERNAME',
                passwordVariable: 'DOCKER_PASSWORD')
            ]) {
              sh """
                docker login --username '${DOCKER_USERNAME}' --password '${DOCKER_PASSWORD}' docker.repo1.uhc.com
                docker push ${ARTIFACTORY_URL}/${IMAGE_NAME}:${env.VERSION}
              """
            }
          }
        }
       stage('Push Docker Image to Azure Registry') {
         steps {
           withCredentials([
              usernamePassword(credentialsId: 'phxdecideacrdev',
                usernameVariable: 'DOCKER_USERNAME',
                passwordVariable: 'DOCKER_PASSWORD')
            ]) {
              sh """
                docker login --username '${DOCKER_USERNAME}' --password '${DOCKER_PASSWORD}' ${env.ACR_REPO_URL}
                docker push "${ACR_REPO_URL}/${IMAGE_NAME}:${env.VERSION}"
                docker push "${ACR_REPO_URL}/${IMAGE_NAME}:latest"
              """
            }
          }
        }
        stage("Deploy Service Azure") {
            when {
                beforeAgent true
                expression { params.deploy_env != 'prod' }
            }
            agent { label 'docker-kitchensink-slave' }
            steps {
                script {
                    withCredentials([azureServicePrincipal(
                            credentialsId: 'phx-decide-aks-sp-dev',
                            subscriptionIdVariable: 'ARM_SUBSCRIPTION_ID',
                            clientIdVariable: 'ARM_CLIENT_ID',
                            clientSecretVariable: 'ARM_CLIENT_SECRET',
                            tenantIdVariable: 'ARM_TENANT_ID')
                    ]) {
                        sh """#!/bin/bash
                          az login --service-principal \
                            -u ${ARM_CLIENT_ID} \
                            -p ${ARM_CLIENT_SECRET} \
                            --tenant ${ARM_TENANT_ID}
                          # ideally parameterize line below to reference the cluster
                          az aks get-credentials --resource-group phx-decide-rg-dev --name phx-decide-aks-dev --overwrite-existing --admin
                          kubectl delete -f k8s/deployments/gpfs-migration-ui.yaml -n archiver
                          sleep 10
                          kubectl apply -f k8s/deployments/gpfs-migration-ui.yaml -n archiver
                          """
                      }
                }
            }
        }
      }
    }
  }
}

