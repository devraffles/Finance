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

# O cache global do uv pode nao estar disponivel para processos MCP isolados.
# Um cache temporario evita falha de inicializacao por permissao sem versionar artefatos.
if (-not $env:UV_CACHE_DIR) {
  $env:UV_CACHE_DIR = Join-Path ([System.IO.Path]::GetTempPath()) "kwak-finance-uv-cache"
}

if (-not $env:UV_TOOL_DIR) {
  $env:UV_TOOL_DIR = Join-Path ([System.IO.Path]::GetTempPath()) "kwak-finance-uv-tools"
}

# mcp-obsidian 0.2.x usa a API do SDK MCP 1.x. Sem este limite, o uv resolve
# o SDK 2.x, cuja API removeu os decorators usados pelo servidor.
uvx --with "mcp<2" mcp-obsidian
