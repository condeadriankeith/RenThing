# PowerShell script to test the listings API endpoint

$uri = "http://localhost:3000/api/listings?limit=5"

try {
    $response = Invoke-RestMethod -Uri $uri -Method Get
    Write-Host "Response received:"
    $response | ConvertTo-Json -Depth 5 | Write-Host
} catch {
    Write-Error "Failed to fetch listings: $_"
}
