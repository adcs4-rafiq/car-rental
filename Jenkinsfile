pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Deploying DriveEasy Car Rental"
            }
        }
        stage('Pull Latest Images') {
            steps {
                withCredentials([string(credentialsId: 'docker-username', variable: 'DOCKER_USERNAME')]) {
                    sh '''
                        docker pull ${DOCKER_USERNAME}/carrental-backend:latest
                        docker pull ${DOCKER_USERNAME}/carrental-worker:latest
                        docker pull ${DOCKER_USERNAME}/carrental-frontend:latest
                    '''
                }
            }
        }
        stage('Deploy to Azure VM') {
            steps {
                withCredentials([string(credentialsId: 'docker-username', variable: 'DOCKER_USERNAME')]) {
                    sh '''
                        scp -i /tmp/azure_key -o StrictHostKeyChecking=no deploy/docker-compose.prod.yml azureuser@20.46.42.44:~/docker-compose.prod.yml
                        scp -i /tmp/azure_key -o StrictHostKeyChecking=no deploy/deploy.sh azureuser@20.46.42.44:~/deploy.sh
                        ssh -i /tmp/azure_key -o StrictHostKeyChecking=no azureuser@20.46.42.44 "
                            export DOCKER_USERNAME=${DOCKER_USERNAME}
                            chmod +x ~/deploy.sh
                            ~/deploy.sh
                        "
                    '''
                }
            }
        }
        stage('Health Check') {
            steps {
                sh '''
                    sleep 15
                    ssh -i /tmp/azure_key -o StrictHostKeyChecking=no azureuser@20.46.42.44 \
                        "curl -sf http://localhost:5000/api/status | grep ok"
                '''
            }
        }
    }
    post {
        success { echo "✅ DriveEasy deployed successfully!" }
        failure { echo "❌ Deployment failed. Check logs above." }
    }
}