# DriveEasy Car Rental — Troubleshooting Guide

## Docker Issues

### Port already in use


# DriveEasy Car Rental — Troubleshooting Guide

## Docker Issues

### Port already in use



Fix: docker compose down, then docker compose up

### Docker login fails (TLS timeout)
Fix: Change DNS to 8.8.8.8 in network adapter settings.

### Docker socket permission denied in Jenkins




Fix:
docker exec -u root jenkins chmod 666 /var/run/docker.sock

## Terraform Issues

### Region not allowed (Azure for Students)
Fix: Use location = "uaenorth" in terraform.tfvars

### Basic SKU public IP not allowed
Fix: Add sku = "Standard" to azurerm_public_ip in main.tf

### SSH key file not found
Fix: Generate key with ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa

## Jenkins Issues

### SSH key permission error (0777 too open)
Fix:
docker exec -u root jenkins chmod 600 /tmp/azure_key
docker exec -u root jenkins chown jenkins:jenkins /tmp/azure_key

### Jenkins API token 401 Unauthorized
Fix: Generate new token via Script Console at /manage/script:
def token = User.get('admin').getProperty(jenkins.security.ApiTokenProperty.class).tokenStore.generateNewToken('new-token')
println token.plainValue
Update JENKINS_TOKEN secret on GitHub.

### Docker not found in Jenkins pipeline
Fix:
docker exec -u root jenkins bash -c "curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-27.3.1.tgz | tar xz --strip-components=1 -C /usr/local/bin docker/docker"

## GitHub Actions Issues

### CI not triggering on branch
Fix: Check on.push.branches in ci.yml includes your branch pattern (feature/**, fix/**)

### Docker push fails unauthorized
Fix: Check DOCKER_USERNAME and DOCKER_PASSWORD secrets in GitHub settings.

## Azure VM Issues

### App not accessible on port 80
ISP blocks port 80. Use port 8081 instead: http://<VM_IP>:8081

### Containers not running after reboot
Fix: docker compose -f docker-compose.prod.yml up -d

## Known Limitations
- Jenkins docker.sock permissions reset on container restart
- SSH key in /tmp/azure_key lost on Jenkins restart — must re-copy
- terraform destroy deletes Jenkins VM — must redeploy after terraform apply
- ISP in Pakistan blocks port 80 — use port 8081
- Azure for Students restricts regions — use uaenorth