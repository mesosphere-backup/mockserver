#!/usr/bin/env groovy

@Library('sec_ci_libs@v2-latest') _

// master_branches are for authentication library, feel free to add your feature/* branch here
def master_branches = ["master"] as String[]

// release branches are for autmatic version bumps
// Do NOT add feature branches here!
// Do NOT add anything you might want to merge into a release branch here!
def release_branches = ["master"] as String[]

pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile.dev'
      args  '--shm-size=1g'
    }
  }
  options {
    timeout(time: 15, unit: 'MINUTES')
  }
  stages {
    stage('Authorization') {
      steps {
        user_is_authorized(master_branches, '8b793652-f26a-422f-a9ba-0d1e47eb9d89', '#frontend-dev')
      }
    }
    stage('Initialization') {
      steps {
        sh "npm install"
      }
    }
    stage('Test') {
      steps {
        sh "npm run test"
      }
      post {
        always {
          junit 'junit.xml'
        }
      }
    }
  }
}
