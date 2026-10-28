param(
    [int]$Porta = 8765
)

$ErrorActionPreference = "Stop"
$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
$pasta = Join-Path $raiz "prototipo"

if (-not (Test-Path (Join-Path $pasta "index.html"))) {
    throw "Pasta do prototipo nao encontrada em $pasta"
}

$python = (Get-Command python -ErrorAction SilentlyContinue)
if (-not $python) {
    $python = (Get-Command py -ErrorAction SilentlyContinue)
}
if (-not $python) {
    throw "Python nao encontrado. Abra o prototipo com um servidor estatico de sua preferencia."
}

Write-Host "EduGestor - prototipo local" -ForegroundColor Cyan
Write-Host "Servindo $pasta em http://localhost:$Porta/" -ForegroundColor DarkGray
Write-Host "Pressione Ctrl+C para encerrar." -ForegroundColor DarkGray

Start-Process "http://localhost:$Porta/"
& $python.Source -m http.server $Porta --directory $pasta