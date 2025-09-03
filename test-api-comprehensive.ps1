# Comprehensive API testing script for listings endpoints

Write-Host "=== Comprehensive Listings API Testing ===" -ForegroundColor Green

$baseUrl = "http://localhost:3000"

# Test 1: GET all listings with different limits
Write-Host "`n1. Testing GET /api/listings with different limits..." -ForegroundColor Yellow
$limits = @(1, 10, 50)
foreach ($limit in $limits) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/listings?limit=$limit" -Method Get
        Write-Host "  Limit $limit - Found $($response.listings.Count) listings, Total: $($response.pagination.total)" -ForegroundColor Green
    } catch {
        Write-Host "  Limit $limit - Error: $_" -ForegroundColor Red
    }
}

# Test 2: Pagination testing
Write-Host "`n2. Testing pagination..." -ForegroundColor Yellow
$pages = @(1, 2, 3)
foreach ($page in $pages) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/listings?page=$page&limit=5" -Method Get
        Write-Host "  Page $page - Found $($response.listings.Count) listings" -ForegroundColor Green
    } catch {
        Write-Host "  Page $page - Error: $_" -ForegroundColor Red
    }
}

# Test 3: Search functionality
Write-Host "`n3. Testing search functionality..." -ForegroundColor Yellow
$searchTerms = @("camera", "tesla", "coffee", "nonexistent")
foreach ($term in $searchTerms) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/listings?search=$term&limit=5" -Method Get
        Write-Host "  Search '$term' - Found $($response.listings.Count) listings" -ForegroundColor Green
    } catch {
        Write-Host "  Search '$term' - Error: $_" -ForegroundColor Red
    }
}

# Test 4: Price filtering
Write-Host "`n4. Testing price filtering..." -ForegroundColor Yellow
$priceRanges = @("minPrice=10&maxPrice=50", "minPrice=100&maxPrice=200", "minPrice=0&maxPrice=10")
foreach ($range in $priceRanges) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/listings?$range&limit=5" -Method Get
        Write-Host "  Price range $range - Found $($response.listings.Count) listings" -ForegroundColor Green
    } catch {
        Write-Host "  Price range $range - Error: $_" -ForegroundColor Red
    }
}

# Test 5: Location filtering
Write-Host "`n5. Testing location filtering..." -ForegroundColor Yellow
$locations = @("San Francisco", "New York", "nonexistent")
foreach ($location in $locations) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/listings?location=$location&limit=5" -Method Get
        Write-Host "  Location '$location' - Found $($response.listings.Count) listings" -ForegroundColor Green
    } catch {
        Write-Host "  Location '$location' - Error: $_" -ForegroundColor Red
    }
}

# Test 6: Error handling - invalid parameters
Write-Host "`n6. Testing error handling..." -ForegroundColor Yellow
$invalidParams = @("limit=-1", "page=0", "limit=abc", "minPrice=invalid")
foreach ($param in $invalidParams) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/api/listings?$param" -Method Get
        if ($response.StatusCode -ne 200) {
            Write-Host "  Invalid param '$param' - Status: $($response.StatusCode)" -ForegroundColor Yellow
        } else {
            Write-Host "  Invalid param '$param' - Unexpected success" -ForegroundColor Red
        }
    } catch {
        Write-Host "  Invalid param '$param' - Error: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

# Test 7: POST endpoint (create listing) - this will likely fail without auth
Write-Host "`n7. Testing POST /api/listings (create listing)..." -ForegroundColor Yellow
$testListing = @{
    title = "Test Listing"
    description = "This is a test listing"
    price = 25.00
    location = "Test City"
    images = @("https://example.com/image.jpg")
    features = @("Test Feature")
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/listings" -Method Post -Body $testListing -ContentType "application/json"
    Write-Host "  POST success - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "  POST failed - Status: $($_.Exception.Response.StatusCode) - Expected for unauthenticated request" -ForegroundColor Yellow
}

# Test 8: Health check endpoint
Write-Host "`n8. Testing health check endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get
    Write-Host "  Health check - Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "  Health check - Error: $_" -ForegroundColor Red
}

Write-Host "`n=== Testing Complete ===" -ForegroundColor Green
