#!/usr/bin/env groovy

@Library('sec_ci_libs@v2-latest') _

def master_branches = ["master", ] as String[]
def release_branches = ["master", ] as String[]

pipeline {
  agent {
    dockerfile {
      args  '--shm-size=1g'
    }
  }
  options {
    timeout(time: 3, unit: 'HOURS')
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
