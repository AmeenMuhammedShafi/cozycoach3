$body = @{
    deviceid = "cc_test123"
    trainId = "69d4c8aaf77d8bc84bdcd418"
    from = "69d4c8aaf77d8bc84bdcd40c"
    to = "69d4c8aaf77d8bc84bdcd40e"
    position = "f"
} | ConvertTo-Json

Write-Host "Sending report request..."
Write-Host "Body: $body"

try {
    $response = Invoke-RestMethod -Uri "http://172.21.38.71:5000/api/report" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -ErrorAction Stop
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json)
} catch {
    Write-Host "ERROR!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Message: $($_.Exception.Message)"
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $errorBody = $reader.ReadToEnd()
    Write-Host "Response Body: $errorBody" -ForegroundColor Red
}
