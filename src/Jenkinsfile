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
                        scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no -r build ubuntu@13.204.66.133:~/health-frontend/

                        scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no .env ubuntu@13.204.66.133:~/health-frontend/.env

                        ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ubuntu@13.204.66.133 "mkdir -p ~/health-frontend/ssl"

                        scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no "%SPRING_SSL_KEY_STORE_FILE%" ubuntu@13.204.66.133:~/health-frontend/ssl/keystore.p12

                        ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ubuntu@13.204.66.133 "cd ~/health-frontend && git pull && docker compose down && docker compose up -d --build"
                    '''
                }
            }
        }
    }
}