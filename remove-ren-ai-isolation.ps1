# PowerShell script to remove the isolated REN AI directory

Write-Host "Removing isolated REN AI directory..." -ForegroundColor Green

# Remove the ren-ai directory and all its contents
Remove-Item -Path "ren-ai" -Recurse -Force

Write-Host "The isolated REN AI directory has been successfully removed!" -ForegroundColor Green