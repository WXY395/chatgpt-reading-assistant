Add-Type -AssemblyName System.Drawing

$targetW = 1280
$targetH = 800
$screenshotDir = 'F:\chatgpt-enhancement\docs\screenshots'
$outputDir     = 'F:\chatgpt-enhancement\docs\screenshots\cws'

# Create output folder
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
    Write-Host "Created output folder: $outputDir"
}

function Resize-ToCanvas {
    param([string]$inputPath, [string]$outputPath)

    $src = [System.Drawing.Image]::FromFile($inputPath)
    $srcW = $src.Width
    $srcH = $src.Height

    Write-Host "  Source: ${srcW}x${srcH}"

    # Create 1280x800 canvas with dark background (#212121 — looks good for CWS)
    $canvas = New-Object System.Drawing.Bitmap($targetW, $targetH)
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Fill background
    $bgColor = [System.Drawing.Color]::FromArgb(255, 33, 33, 33)
    $g.Clear($bgColor)

    # Calculate scale to fit inside canvas with 40px padding
    $padding = 40
    $availW  = $targetW - $padding * 2
    $availH  = $targetH - $padding * 2
    $scaleX  = $availW / $srcW
    $scaleY  = $availH / $srcH
    $scale   = [Math]::Min($scaleX, $scaleY)
    $scale   = [Math]::Min($scale, 1.0)   # Don't upscale beyond 100%

    $drawW = [int]($srcW * $scale)
    $drawH = [int]($srcH * $scale)
    $drawX = [int](($targetW - $drawW) / 2)
    $drawY = [int](($targetH - $drawH) / 2)

    # Draw drop shadow (offset 4px, semi-transparent black)
    $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(80, 0, 0, 0))
    $g.FillRectangle($shadowBrush, ($drawX + 4), ($drawY + 4), $drawW, $drawH)
    $shadowBrush.Dispose()

    # Draw the image
    $destRect = New-Object System.Drawing.Rectangle($drawX, $drawY, $drawW, $drawH)
    $g.DrawImage($src, $destRect)

    $src.Dispose()
    $g.Dispose()

    $canvas.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $canvas.Dispose()
}

# Process each PNG (skip .psd, .gitkeep, already-processed files)
$pngs = Get-ChildItem $screenshotDir -Filter '*.png' | Where-Object { $_.DirectoryName -eq $screenshotDir }

foreach ($file in $pngs) {
    $outFile = Join-Path $outputDir $file.Name
    Write-Host "Processing: $($file.Name)"
    Resize-ToCanvas -inputPath $file.FullName -outputPath $outFile
    $result = Get-Item $outFile
    Write-Host "  Output: $($result.Length) bytes -> $outFile"
    Write-Host ""
}

Write-Host "All done. CWS-ready screenshots in: $outputDir"
