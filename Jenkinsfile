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
    stage('Bump Version') {
      when {
        expression {
          release_branches.contains(BRANCH_NAME)
        }
      }
      steps {
        withCredentials([
            usernamePassword(credentialsId: 'a7ac7f84-64ea-4483-8e66-bb204484e58f', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USER')
        ]) {
          sh "git fetch"
          sh "git checkout $BRANCH_NAME"
          sh "echo Last Commit: \$(git log -1 --oneline)"
          sh "[ \"\$(git log --oneline \$(git tag -l --sort=-version:refname | head -1)...HEAD | grep -E '(fix?(.+):|feat?(.+):|perf?(.+):)' | wc -l)\" -ne 0 ] && npm run release && git push --follow-tags https://$GIT_USER:$GIT_PASSWORD@github.com/mesosphere/mockserver $BRANCH_NAME || echo 'Last commit it not a merge.'"
        }
      }
    }
  }
}
