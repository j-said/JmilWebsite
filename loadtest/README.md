# Load test (k6)

```bash
./loadtest/run.sh <run-name>                 # 40 VUs, 3m up / 5m steady / 2m down, against frontend_url (CloudFront)
VUS=60 ./loadtest/run.sh heavier
WRITE_MODE=async ./loadtest/run.sh queue     # writes go through POST /orders/async
BASE_URL=http://localhost:8000 VUS=5 RAMP_UP=10s STEADY=20s RAMP_DOWN=5s ./loadtest/run.sh smoke
```

Needs `k6` or Docker. Results go to `results/<run-name>.txt`, `.json` and `.log`.

After a run, wait until the API is back to 1 task (15–25 min):

```bash
aws ecs describe-services --cluster jmil-cluster --services jmil-api \
  --query 'services[0].[desiredCount,runningCount]'
```

Details: [docs/LOADTEST.md](../docs/LOADTEST.md).
