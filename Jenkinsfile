pipeline {
    agent any

    tools {
        nodejs "node20"
    }
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhubcredentials')
        DOCKERHUB_REGISTRY = 'anas129/frontend'
        SCANNER_HOME=tool 'sonar-scanner'
        NEXUS_VERSION = 'nexus3'
        NEXUS_PROTOCOL = 'http'
        NEXUS_URL = 'nexus:8081'
        NEXUS_REPOSITORY = 'frontend-nexus-repo'
        NEXUS_CREDENTIAL_ID = 'nexus-user-credentials'
        NEXUS_CREDENTIALS = credentials("${NEXUS_CREDENTIAL_ID}")
    }

    stages {
        stage('git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Anas4444/frontend.git'
            }
        }

        stage('SONARQUBE-ANALYSIS') {
            steps() {
                sh "echo hello from sonar"
            }
        }

        stage('Build Package') {
            steps() {
                sh "npm ci"
                sh "npm run build"
            }
        }

        stage('Publish to Nexus') {
            steps() {
                sh "echo hello from nexus"
            }
        }

        stage('Build & Push Docker Image') {
            steps() {
                sh 'docker build -t $DOCKERHUB_REGISTRY:$BUILD_NUMBER .'
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh 'docker push $DOCKERHUB_REGISTRY:$BUILD_NUMBER'
            }
        }

        stage('Deploy') {
            steps() {
                sh "echo Frontend deployed"
            }
        }
    }
}