# DriveEasy Car Rental — Demo Script

## Cloud URLs
- Frontend: http://20.46.42.44:8081
- API: http://20.46.42.44:5000/api/status
- Jenkins: http://20.46.42.44:8080
- GitHub: https://github.com/adcs4-rafiq/car-rental

## Final Demo Steps

### Step 1 — Show Live App
Open http://20.46.42.44:8081 — show DriveEasy running with API Online indicator.

### Step 2 — Create Branch
```bash
git checkout -b fix/demo-live-change
```

### Step 3 — Make Visible Change
Edit frontend-js/src/App.jsx
Change: Car Rental System v2.0
To:     Car Rental System v3.0

### Step 4 — Push and Open PR
```bash
git add frontend-js/src/App.jsx
git commit -m "fix: update to v3.0 for live demo"
git push origin fix/demo-live-change
```
Open PR at: https://github.com/adcs4-rafiq/car-rental/pulls

### Step 5 — Show CI Running
Go to https://github.com/adcs4-rafiq/car-rental/actions
Show all 5 jobs passing: .NET tests, Python tests, JS tests, Docker build, Jenkins trigger.

### Step 6 — Merge PR
Click Merge pull request after CI passes.

### Step 7 — Show Jenkins Auto-Deploy
Open http://20.46.42.44:8080/job/carrental-deploy/
Show new build triggered automatically, all stages green.

### Step 8 — Show Live Change
Refresh http://20.46.42.44:8081
Show "Car Rental System v3.0" in header — deployed without manual intervention!

### Step 9 — Terraform Destroy + Apply
```bash
cd infra
terraform destroy   # destroys 8 Azure resources
terraform apply     # recreates everything fresh
```
Show new VM IP in output. Redeploy app and show it works again.
