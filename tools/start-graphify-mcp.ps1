Set-Location (Split-Path -Parent $PSScriptRoot)

$graphPath = Join-Path (Get-Location) "graphify-out\graph.json"

if (-not (Test-Path $graphPath)) {
  Write-Error "Graphify graph not found at graphify-out\graph.json. Generate it with 'uvx --from graphifyy graphify . --code-only' before starting this MCP."
  exit 1
}

# Use a temporary cache so the MCP process works without depending on the user's
# global uv cache or tool directory. No project source files are modified.
if (-not $env:UV_CACHE_DIR) {
  $env:UV_CACHE_DIR = Join-Path ([System.IO.Path]::GetTempPath()) "kwak-finance-uv-cache"
}

if (-not $env:UV_TOOL_DIR) {
  $env:UV_TOOL_DIR = Join-Path ([System.IO.Path]::GetTempPath()) "kwak-finance-uv-tools"
}

uvx --from "graphifyy[mcp]" python -m graphify.serve "graphify-out/graph.json"
