Write-Host "=== Comprehensive API Endpoints Testing ===" -ForegroundColor Green

$baseUrl = "http://localhost:3000"

# Test health endpoint
Write-Host "`n1. Testing health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health" -Method GET
    Write-Host "  Health check - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "  Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test wishlist endpoint (GET)
Write-Host "`n2. Testing wishlist endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/wishlist" -Method GET
    Write-Host "  GET /api/wishlist - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "  GET /api/wishlist failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test users endpoint (GET)
Write-Host "`n3. Testing users endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/users" -Method GET
    Write-Host "  GET /api/users - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "  GET /api/users failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test reviews endpoint (GET)
Write-Host "`n4. Testing reviews endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/reviews" -Method GET
    Write-Host "  GET /api/reviews - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "  GET /api/reviews failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test search endpoint
Write-Host "`n5. Testing search endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/search?q=test" -Method GET
    Write-Host "  GET /api/search - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "  GET /api/search failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test bookings endpoint (GET)
Write-Host "`n6. Testing bookings endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/bookings" -Method GET
    Write-Host "  GET /api/bookings - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "  GET /api/bookings failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test transactions endpoint (GET)
Write-Host "`n7. Testing transactions endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/transactions" -Method GET
    Write-Host "  GET /api/transactions - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "  GET /api/transactions failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test auth session endpoint
Write-Host "`n8. Testing auth session endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/session" -Method GET
    Write-Host "  GET /api/auth/session - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "  GET /api/auth/session failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test POST endpoints (should return 401 for unauthenticated)
Write-Host "`n9. Testing POST endpoints (unauthenticated)..." -ForegroundColor Yellow
$endpoints = @("bookings", "reviews", "wishlist", "users")

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/api/$endpoint" -Method POST -Body "{}" -ContentType "application/json"
        Write-Host "  POST /api/$endpoint - Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401) {
            Write-Host "  POST /api/$endpoint - Status: 401 (Expected for unauthenticated)" -ForegroundColor Green
        } else {
            Write-Host "  POST /api/$endpoint - Status: $statusCode - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n=== Testing Complete ===" -ForegroundColor Green
