pipeline {
    agent any
    environment {
        DOCKER_USERNAME = credentials('docker-username')
        VM_HOST         = credentials('azure-vm-host')
        VM_USER         = credentials('azure-vm-user')
        SSH_KEY         = '/tmp/azure_key'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Deploying DriveEasy Car Rental — branch: ${env.BRANCH_NAME}"
            }
        }
        stage('Pull Latest Images') {
            steps {
                sh '''
                    docker pull ${DOCKER_USERNAME}/carrental-backend:latest
                    docker pull ${DOCKER_USERNAME}/carrental-worker:latest
                    docker pull ${DOCKER_USERNAME}/carrental-frontend:latest
                '''
            }
        }
        stage('Deploy to Azure VM') {
            steps {
                sh '''
                    scp -i ${SSH_KEY} -o StrictHostKeyChecking=no deploy/docker-compose.prod.yml ${VM_USER}@${VM_HOST}:~/docker-compose.prod.yml
                    scp -i ${SSH_KEY} -o StrictHostKeyChecking=no deploy/deploy.sh ${VM_USER}@${VM_HOST}:~/deploy.sh
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${VM_USER}@${VM_HOST} "
                        export DOCKER_USERNAME=${DOCKER_USERNAME}
                        chmod +x ~/deploy.sh
                        ~/deploy.sh
                    "
                '''
            }
        }
        stage('Health Check') {
            steps {
                sh '''
                    sleep 15
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${VM_USER}@${VM_HOST} \
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