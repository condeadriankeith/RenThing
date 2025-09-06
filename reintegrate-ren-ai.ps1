# PowerShell script to reintegrate REN AI files from the isolated directory back to their original locations

Write-Host "Reintegrating REN AI files..." -ForegroundColor Green

# Copy service files
Write-Host "Copying service files..." -ForegroundColor Yellow
Copy-Item -Path "ren-ai\services\*" -Destination "lib\ai\" -Force

# Copy component files
Write-Host "Copying component files..." -ForegroundColor Yellow
Copy-Item -Path "ren-ai\components\*" -Destination "components\ai\" -Force

# Copy hook files
Write-Host "Copying hook files..." -ForegroundColor Yellow
Copy-Item -Path "ren-ai\hooks\*" -Destination "hooks\" -Force

# Copy page files
Write-Host "Copying page files..." -ForegroundColor Yellow
Copy-Item -Path "ren-ai\pages\*" -Destination "app\ai-demo\" -Force

# Copy API route files
Write-Host "Copying API route files..." -ForegroundColor Yellow
Copy-Item -Path "ren-ai\api\chat\*" -Destination "app\api\ai\chat\" -Force
Copy-Item -Path "ren-ai\api\feedback\*" -Destination "app\api\ai\feedback\" -Force
Copy-Item -Path "ren-ai\api\improve\*" -Destination "app\api\ai\improve\" -Force
Copy-Item -Path "ren-ai\api\live-data\*" -Destination "app\api\ai\live-data\" -Force
Copy-Item -Path "ren-ai\api\preferences\*" -Destination "app\api\ai\preferences\" -Force
Copy-Item -Path "ren-ai\api\recommendations\*" -Destination "app\api\ai\recommendations\" -Force
Copy-Item -Path "ren-ai\api\suggestions\*" -Destination "app\api\ai\suggestions\" -Force

Write-Host "REN AI files have been successfully reintegrated!" -ForegroundColor Green
Write-Host "You can now remove the 'ren-ai' directory if it's no longer needed." -ForegroundColor Cyan