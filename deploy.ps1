# Usage: .\deploy.ps1

try {
    icp network start -d
    icp canister create --environment local frontend
    icp canister create --environment local backend

    $env:BACKEND_CANISTER_ID = (icp canister settings show --environment local --id-only backend)
    $env:STORAGE_GATEWAY_URL = "http://localhost:6188"
    $env:II_URL = "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8000"

    icp deploy --environment local frontend backend

    Write-Host "Press Ctrl+C to stop the deployment and exit."
    while ($true) {
        Start-Sleep -Seconds 2
    }
} finally {
    Write-Host "Stopping icp network..."
    icp network stop
}
