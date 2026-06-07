# DriveEasy Car Rental — Setup Guide

## Project Overview
DriveEasy is a three-tier polyglot car rental application deployed using a fully automated DevOps pipeline.

## Team Members
- Mohammad Rafiq — Full Stack & DevOps

## Technology Stack
| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | ASP.NET Core Web API |
| Worker | Python 3.11 |
| Queue | Redis 7 |
| Containerization | Docker + Docker Compose |
| Orchestration | Docker Swarm |
| Infrastructure | Terraform (Azure) |
| CI | GitHub Actions |
| CD | Jenkins |
| Registry | Docker Hub (rafiq1122) |

## Prerequisites
- Docker Desktop
- Terraform >= 1.5.0
- Azure CLI
- Git
- Node.js 20

## Local Setup (Docker Compose)
```bash
git clone https://github.com/adcs4-rafiq/car-rental.git
cd car-rental
docker compose up --build
```
Frontend: http://localhost:8081
API: http://localhost:5000/api/status

## Docker Swarm
```bash
docker swarm init
$env:DOCKER_USERNAME="rafiq1122"
docker stack deploy -c docker-stack.yml carrental-app
docker service ls
```

## Terraform (Azure)
```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
terraform init && terraform plan && terraform apply
```

## GitHub Secrets Required
- DOCKER_USERNAME, DOCKER_PASSWORD
- JENKINS_URL, JENKINS_USER, JENKINS_TOKEN

## Jenkins Credentials Required
- docker-username, azure-vm-host, azure-vm-user, azure-ssh-key

## Secrets Management
- No hardcoded secrets in repo
- terraform.tfvars in .gitignore
- SSH keys never committed