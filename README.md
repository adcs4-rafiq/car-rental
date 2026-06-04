# DriveEasy — Car Rental System

![CI](https://github.com/YOUR_ORG/car-rental/actions/workflows/ci.yml/badge.svg)

A professional three-tier polyglot car rental application with full DevOps automation.

## Stack
| Tier | Technology |
|------|-----------|
| Frontend | JavaScript — React 18 + Vite |
| Backend  | C# — ASP.NET Core 8 Web API |
| Worker   | Python 3.11 |
| Queue    | Redis 7 |
| Infra    | Terraform → Azure |
| CI       | GitHub Actions |
| CD       | Jenkins |

## Features
- Browse car fleet (Sedan, SUV, Luxury, Sports, Van)
- Book a car with customer details and date range
- Automatic price calculation
- Cancel bookings
- Python worker processes booking confirmations via Redis
- Live system status dashboard

## Quick Start
```bash
docker compose up --build
```
- Frontend: http://localhost:3000
- API:      http://localhost:5000/api/status

## Docker Swarm
```bash
docker swarm init
docker stack deploy -c docker-stack.yml carrental-app
docker service ls
```

## Terraform (Azure)
```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# Fill in your Azure subscription ID
terraform init && terraform plan && terraform apply
```
# CI Test
