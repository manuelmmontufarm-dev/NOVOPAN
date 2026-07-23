# Servidor local del SIMULADOR NOVOPAN - no instala nada, usa PowerShell de Windows.
$ErrorActionPreference = "Stop"
$root = Join-Path $PSScriptRoot "sitio"

if (-not (Test-Path $root)) {
  Write-Host "ERROR: no encuentro la carpeta 'sitio' junto a este archivo." -ForegroundColor Red
  Read-Host "Presiona ENTER para cerrar"
  exit 1
}

$mime = @{
  ".html"="text/html; charset=utf-8"; ".htm"="text/html; charset=utf-8";
  ".js"="text/javascript"; ".mjs"="text/javascript";
  ".css"="text/css"; ".json"="application/json";
  ".csv"="text/csv; charset=utf-8"; ".txt"="text/plain; charset=utf-8";
  ".svg"="image/svg+xml"; ".png"="image/png"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg";
  ".gif"="image/gif"; ".ico"="image/x-icon"; ".webp"="image/webp";
  ".woff"="font/woff"; ".woff2"="font/woff2"; ".ttf"="font/ttf"; ".otf"="font/otf";
  ".map"="application/json"; ".webmanifest"="application/manifest+json";
  ".xlsx"="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
}

# Buscar un puerto libre a partir de 8080
$listener = $null
$port = 0
foreach ($p in 8080..8090) {
  try {
    $l = New-Object System.Net.HttpListener
    $l.Prefixes.Add("http://localhost:$p/")
    $l.Start()
    $listener = $l; $port = $p; break
  } catch { }
}

if ($null -eq $listener) {
  Write-Host "No se pudo abrir ningun puerto (8080-8090)." -ForegroundColor Red
  Read-Host "Presiona ENTER para cerrar"
  exit 1
}

$url = "http://localhost:$port/@@OPEN@@"
Write-Host ""
Write-Host "  SIMULADOR NOVOPAN corriendo en:  $url" -ForegroundColor Green
Write-Host "  (deja esta ventana negra ABIERTA mientras usas el simulador)"
Write-Host "  Para apagarlo: cierra esta ventana." -ForegroundColor Yellow
Write-Host ""
Start-Process $url

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ($rel -eq "/") { $rel = "/index.html" }
    $path = Join-Path $root ($rel.TrimStart("/") -replace "/", "\")

    if (Test-Path $path -PathType Container) { $path = Join-Path $path "index.html" }
    if (-not (Test-Path $path -PathType Leaf)) {
      if (Test-Path ($path + ".html") -PathType Leaf) { $path = $path + ".html" }
    }

    if (Test-Path $path -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      $ct = $mime[$ext]; if (-not $ct) { $ct = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $ctx.Response.ContentType = $ct
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $b = [Text.Encoding]::UTF8.GetBytes("404 - no encontrado")
      $ctx.Response.OutputStream.Write($b, 0, $b.Length)
    }
    $ctx.Response.Close()
  } catch { }
}
