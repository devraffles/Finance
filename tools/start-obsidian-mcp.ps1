Set-Location (Split-Path -Parent $PSScriptRoot)

$restConfigPath = Join-Path (Get-Location) ".obsidian\plugins\obsidian-local-rest-api\data.json"
if (Test-Path $restConfigPath) {
  $restConfig = Get-Content -Raw -Path $restConfigPath | ConvertFrom-Json

  if (-not $env:OBSIDIAN_API_KEY -and $restConfig.apiKey) {
    $env:OBSIDIAN_API_KEY = $restConfig.apiKey
  }

  if (-not $env:OBSIDIAN_PORT -and $restConfig.port) {
    $env:OBSIDIAN_PORT = [string]$restConfig.port
  }
}

if (-not $env:OBSIDIAN_API_KEY) {
  Write-Error "OBSIDIAN_API_KEY is not set. Enable Obsidian's Local REST API plugin for this vault first."
  exit 1
}

if (-not $env:OBSIDIAN_HOST) {
  $env:OBSIDIAN_HOST = "127.0.0.1"
}

if (-not $env:OBSIDIAN_PORT) {
  $env:OBSIDIAN_PORT = "27124"
}

uvx mcp-obsidian
