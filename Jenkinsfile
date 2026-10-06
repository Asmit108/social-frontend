pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install dependencies') {
            steps {
                bat 'npm install'
            }
        }
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
        stage('Deploy Frontend') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ec2-ssh-key',
                        keyFileVariable: 'SSH_KEY',
                    ),
                    file(
                        credentialsId: 'KeyStore',
                        variable: 'SPRING_SSL_KEY_STORE_FILE'
                    ),
                    string(
                        credentialsId: 'keystore-password',
                        variable: 'SPRING_SSL_KEY_STORE_PASSWORD'
                    )
                ]) {
                    writeFile file: '.env', text: """
                    SPRING_SSL_KEY_STORE_PASSWORD=${SPRING_SSL_KEY_STORE_PASSWORD}
                    SPRING_SSL_KEY_STORE_FILE=./ssl/keystore.p12
                    """
                    bat '''
                        scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no -r build ubuntu@3.108.215.224:~/social-frontend/

                        scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no .env ubuntu@3.108.215.224:~/social-frontend/.env

                        ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ubuntu@3.108.215.224 "mkdir -p ~/social-frontend/ssl"

                        scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no "%SPRING_SSL_KEY_STORE_FILE%" ubuntu@3.108.215.224:~/social-frontend/ssl/keystore.p12

                        ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ubuntu@3.108.215.224 "cd ~/social-frontend && git pull && docker compose down && docker compose up -d --build"
                    '''
                }
            }
        }
    }
}