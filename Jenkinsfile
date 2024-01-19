pipeline {
    agent any

    /*tools {
        nodejs "node20"
    }*/
    environment {
        DOCKERHUB_CREDENTIALS = credentials('credentials-docker')
        DOCKERHUB_REGISTRY = 'seifkhadraoui/frontend'
        SCANNER_HOME=tool 'sonar-scanner'
        NEXUS_VERSION = 'nexus3'
        NEXUS_PROTOCOL = 'http'
        NEXUS_URL = 'nexus:8081'
        NEXUS_REPOSITORY = 'frontend-nexus-repo'
        NEXUS_CREDENTIAL_ID = 'nexus-user-credential'
        NEXUS_CREDENTIALS = credentials("${NEXUS_CREDENTIAL_ID}")
    }

    stages {
        stage('git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/destrakz/frontend.git'
            }
        }

        stage('SONARQUBE-ANALYSIS') {
            steps() {
                sh "echo hello from sonar"
            }
        }

        /*stage('Build Package') {
            steps() {
                sh "npm ci"
            }
        }*/

        stage('Publish to Nexus') {
            steps() {
                sh "echo hello from nexus"
            }
        }

        stage('Build & Push Docker Image') {
            steps() {
                sh 'docker build -t $DOCKERHUB_REGISTRY:latest .'
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh 'docker push $DOCKERHUB_REGISTRY:latest'
            }
        }

        stage('Deploy') {
            steps() {
                script {
                    sh "docker compose -p 'devops' down || echo 'project devops not running'"
                    sh "docker compose -p 'devops' up -d --build"
                }
            }
        }
    }
}
