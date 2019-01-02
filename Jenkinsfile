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
        sh "npm test -- --forceExit"
      }
      post {
        always {
          junit 'junit.xml'
        }
      }
    }
    stage('Semantic Release') {
      when {
        expression {
          release_branches.contains(BRANCH_NAME)
        }
      }
      steps {
        withCredentials([
          string(credentialsId: "d146870f-03b0-4f6a-ab70-1d09757a51fc", variable: "GH_TOKEN"),
          string(credentialsId: '1308ac87-5de8-4120-8417-b3fc8d5b4ecc', variable: 'NPM_TOKEN')
        ]) {
          sh "npx semantic-release"
        }
      }
    }
  }
}
