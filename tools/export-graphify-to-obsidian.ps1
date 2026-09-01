[CmdletBinding()]
param(
    [string]$GraphPath = (Join-Path (Split-Path -Parent $PSScriptRoot) "graphify-out\graph.json"),
    [string]$OutputPath = (Join-Path (Split-Path -Parent $PSScriptRoot) "graphify-notes")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Escape-YamlDoubleQuoted {
    param([Parameter(Mandatory)][string]$Value)

    return $Value.Replace("\\", "\\\\").Replace('"', '\"')
}

if (-not (Test-Path -LiteralPath $GraphPath -PathType Leaf)) {
    throw "Grafo Graphify nao encontrado em '$GraphPath'. Execute 'graphify . --update --code-only' primeiro."
}

$vaultRoot = Split-Path -Parent $PSScriptRoot
$resolvedGraphPath = (Resolve-Path -LiteralPath $GraphPath).Path
$resolvedOutputPath = [System.IO.Path]::GetFullPath($OutputPath)

if (-not $resolvedOutputPath.StartsWith($vaultRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "A pasta de saida deve ficar dentro do vault Obsidian."
}

$graph = Get-Content -LiteralPath $resolvedGraphPath -Raw | ConvertFrom-Json
$nodes = @($graph.nodes)
$links = @($graph.links)

if ($nodes.Count -eq 0) {
    throw "O grafo Graphify nao contem nos para exportar."
}

$nodeById = @{}
foreach ($node in $nodes) {
    if ([string]::IsNullOrWhiteSpace($node.id)) {
        continue
    }

    $nodeById[$node.id] = $node
}

$neighborsById = @{}
foreach ($nodeId in $nodeById.Keys) {
    $neighborsById[$nodeId] = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
}

foreach ($link in $links) {
    if (-not $nodeById.ContainsKey($link.source) -or -not $nodeById.ContainsKey($link.target)) {
        continue
    }

    [void]$neighborsById[$link.source].Add($link.target)
    [void]$neighborsById[$link.target].Add($link.source)
}

if (Test-Path -LiteralPath $resolvedOutputPath) {
    Remove-Item -LiteralPath $resolvedOutputPath -Recurse -Force
}

[void](New-Item -ItemType Directory -Path $resolvedOutputPath -Force)

foreach ($nodeId in ($nodeById.Keys | Sort-Object)) {
    $node = $nodeById[$nodeId]
    $label = if ([string]::IsNullOrWhiteSpace($node.label)) { $nodeId } else { [string]$node.label }
    $sourceFile = if ([string]::IsNullOrWhiteSpace($node.source_file)) { "" } else { [string]$node.source_file }
    $sourceLocation = if ([string]::IsNullOrWhiteSpace($node.source_location)) { "" } else { [string]$node.source_location }
    $relations = @($neighborsById[$nodeId] | Sort-Object)

    $content = [System.Collections.Generic.List[string]]::new()
    $content.Add("---")
    $content.Add(('graphify_id: "{0}"' -f (Escape-YamlDoubleQuoted $nodeId)))
    $content.Add(('graphify_label: "{0}"' -f (Escape-YamlDoubleQuoted $label)))
    $content.Add(('source_file: "{0}"' -f (Escape-YamlDoubleQuoted $sourceFile)))
    $content.Add(('source_location: "{0}"' -f (Escape-YamlDoubleQuoted $sourceLocation)))
    $content.Add("tags:")
    $content.Add("  - graphify")
    $content.Add("---")
    $content.Add("")
    $content.Add(("# {0}" -f $label))
    $content.Add("")
    $content.Add("Gerado automaticamente de `graphify-out/graph.json`. Nao edite esta nota.")
    $content.Add("")
    $content.Add("## Conexoes")
    $content.Add("")

    if ($relations.Count -eq 0) {
        $content.Add("Sem conexoes extraidas pelo Graphify.")
    } else {
        foreach ($relatedId in $relations) {
            $relatedLabel = $nodeById[$relatedId].label
            if ([string]::IsNullOrWhiteSpace($relatedLabel)) {
                $relatedLabel = $relatedId
            }

            $content.Add(("- [[{0}|{1}]]" -f $relatedId, $relatedLabel.Replace("|", "\\|")))
        }
    }

    $notePath = Join-Path $resolvedOutputPath ("{0}.md" -f $nodeId)
    [System.IO.File]::WriteAllLines($notePath, $content, [System.Text.UTF8Encoding]::new($false))
}

Write-Host ("Exportacao concluida: {0} nos e {1} arestas do Graphify foram publicados em '{2}'." -f $nodeById.Count, $links.Count, $resolvedOutputPath)
Write-Host "No Obsidian, recarregue o painel 3D Graph para visualizar as conexoes."
