$port = 8000
$root = (Get-Location).Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Listening on port $port..."

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ($urlPath -eq "") { $urlPath = "index.html" }
        
        $filePath = Join-Path $root $urlPath

        if (Test-Path $filePath -PathType Leaf) {
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mimeType = "application/octet-stream"
            switch ($extension) {
                ".html" { $mimeType = "text/html" }
                ".css"  { $mimeType = "text/css" }
                ".js"   { $mimeType = "application/javascript" }
                ".png"  { $mimeType = "image/png" }
                ".jpg"  { $mimeType = "image/jpeg" }
            }

            $response.ContentType = $mimeType
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
        }
        $response.Close()
    }
} catch {
    Write-Host "Error: $_"
} finally {
    $listener.Stop()
}
