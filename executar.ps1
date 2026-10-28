<#
    Compila e abre o EntreLivros sem precisar do Visual Studio.

    O projeto e WinForms para .NET Framework 4.7.2. O SDK do .NET (8+)
    e usado apenas como compilador/MSBuild; o executavel continua sendo
    .NET Framework e roda com o runtime 4.7.2 ou superior do Windows.

    Uso:
      powershell -ExecutionPolicy Bypass -File .\executar.ps1
      powershell -ExecutionPolicy Bypass -File .\executar.ps1 -SomenteCompilar
#>
[CmdletBinding()]
param(
    [string]$Configuration = 'Debug',
    [switch]$SomenteCompilar
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
$csproj = Join-Path $raiz 'ProjetoFinal-C#\ProjetoFinal-C#\ProjetoFinal-C#.csproj'
$packages = Join-Path $raiz 'ProjetoFinal-C#\packages'
$refasm = Join-Path $env:LOCALAPPDATA 'EntreLivrosBuild\refasm'

function Resolve-Dotnet {
    $comando = Get-Command dotnet -ErrorAction SilentlyContinue
    if ($comando) { return $comando.Source }

    $noPerfil = Join-Path $env:USERPROFILE '.dotnet\dotnet.exe'
    if (Test-Path $noPerfil) { return $noPerfil }

    throw 'SDK do .NET nao encontrado. Instale com: winget install Microsoft.DotNet.SDK.8'
}

# O NuGet do Visual Studio nao esta disponivel aqui, entao os pacotes
# usados pelo csproj sao baixados do nuget.org na primeira execucao.
function Install-Pacote {
    param(
        [string]$Id,
        [string]$Versao,
        [string]$Destino,
        [string]$Marcador
    )

    if (Test-Path $Marcador) { return }

    Write-Host "Baixando $Id $Versao..."
    $url = "https://api.nuget.org/v3-flatcontainer/$Id/$Versao/$Id.$Versao.nupkg"
    $zip = Join-Path $env:TEMP "$Id.$Versao.zip"
    Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
    New-Item -ItemType Directory -Force -Path $Destino | Out-Null
    Expand-Archive -Path $zip -DestinationPath $Destino -Force
    Remove-Item $zip -Force
}

$dotnet = Resolve-Dotnet

Install-Pacote 'stub.system.data.sqlite.core.netframework' '1.0.118' `
    (Join-Path $packages 'Stub.System.Data.SQLite.Core.NetFramework.1.0.118.0') `
    (Join-Path $packages 'Stub.System.Data.SQLite.Core.NetFramework.1.0.118.0\build\net46\Stub.System.Data.SQLite.Core.NetFramework.targets')

Install-Pacote 'system.data.sqlite.core' '1.0.118' `
    (Join-Path $packages 'System.Data.SQLite.Core.1.0.118.0') `
    (Join-Path $packages 'System.Data.SQLite.Core.1.0.118.0\System.Data.SQLite.Core.nuspec')

Install-Pacote 'microsoft.netframework.referenceassemblies.net472' '1.0.3' $refasm `
    (Join-Path $refasm 'build\.NETFramework\v4.7.2\mscorlib.dll')

Write-Host "Compilando ($Configuration)..."
$argumentos = @(
    'msbuild', $csproj, '-nologo', '-v:m',
    "-p:Configuration=$Configuration",
    "-p:TargetFrameworkRootPath=$refasm\build\",
    '-p:GenerateResourceMSBuildRuntime=CurrentRuntime',
    '-p:GenerateResourceMSBuildArchitecture=CurrentArchitecture'
)
& $dotnet @argumentos
if ($LASTEXITCODE -ne 0) {
    throw "Falha na compilacao (codigo $LASTEXITCODE)."
}

$pastaSaida = Join-Path (Split-Path $csproj) "bin\$Configuration"
$exe = Join-Path $pastaSaida 'EntreLivros.exe'

if ($SomenteCompilar) {
    Write-Host "Executavel gerado em: $exe"
    return
}

Write-Host 'Abrindo EntreLivros...'
Start-Process -FilePath $exe -WorkingDirectory $pastaSaida