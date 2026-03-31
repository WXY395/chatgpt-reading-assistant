Add-Type -AssemblyName System.Drawing

function Create-CRAIcon {
    param([int]$size, [string]$outputPath)

    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # --- Background: ChatGPT green rounded rectangle ---
    $bgColor = [System.Drawing.Color]::FromArgb(255, 16, 163, 127)
    $bgBrush = New-Object System.Drawing.SolidBrush($bgColor)

    $radius = [int]($size * 0.20)
    $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
    $gp.AddArc(0, 0, $radius * 2, $radius * 2, 180, 90)
    $gp.AddArc($size - $radius * 2, 0, $radius * 2, $radius * 2, 270, 90)
    $gp.AddArc($size - $radius * 2, $size - $radius * 2, $radius * 2, $radius * 2, 0, 90)
    $gp.AddArc(0, $size - $radius * 2, $radius * 2, $radius * 2, 90, 90)
    $gp.CloseAllFigures()
    $g.FillPath($bgBrush, $gp)

    # --- Book icon in white ---
    $white = [System.Drawing.Color]::FromArgb(255, 255, 255, 255)

    $pad    = [int]($size * 0.18)
    $mid    = [int]($size * 0.50)
    $top    = [int]($size * 0.20)
    $bot    = [int]($size * 0.80)
    $coverW = [float]([Math]::Max(1.5, $size * 0.07))
    $lineW  = [float]([Math]::Max(1.0, $size * 0.045))

    $coverPen = New-Object System.Drawing.Pen($white, $coverW)
    $coverPen.LineJoin  = [System.Drawing.Drawing2D.LineJoin]::Round
    $coverPen.StartCap  = [System.Drawing.Drawing2D.LineCap]::Round
    $coverPen.EndCap    = [System.Drawing.Drawing2D.LineCap]::Round

    # Spine (vertical center line)
    $g.DrawLine($coverPen, $mid, $top, $mid, $bot)

    # Left cover: spine-top → left-top-corner → left-bot-corner → spine-bot
    $leftPts = @(
        [System.Drawing.PointF]::new($mid, $top),
        [System.Drawing.PointF]::new($pad, [float]($top + $size * 0.07)),
        [System.Drawing.PointF]::new($pad, [float]($bot - $size * 0.07)),
        [System.Drawing.PointF]::new($mid, $bot)
    )
    $g.DrawLines($coverPen, $leftPts)

    # Right cover: spine-top → right-top-corner → right-bot-corner → spine-bot
    $rightPts = @(
        [System.Drawing.PointF]::new($mid, $top),
        [System.Drawing.PointF]::new([float]($size - $pad), [float]($top + $size * 0.07)),
        [System.Drawing.PointF]::new([float]($size - $pad), [float]($bot - $size * 0.07)),
        [System.Drawing.PointF]::new($mid, $bot)
    )
    $g.DrawLines($coverPen, $rightPts)

    # Text lines (only for 48px and above)
    if ($size -ge 48) {
        $textPen = New-Object System.Drawing.Pen($white, $lineW)
        $textPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $textPen.EndCap   = [System.Drawing.Drawing2D.LineCap]::Round

        $linesCount  = 3
        $innerTop    = $top + [int]($size * 0.17)
        $innerBot    = $bot - [int]($size * 0.12)
        $spacing     = [int](($innerBot - $innerTop) / ($linesCount + 1))

        # Left page lines
        $lx1 = $pad + [int]($size * 0.07)
        $lx2 = $mid - [int]($size * 0.07)
        for ($i = 1; $i -le $linesCount; $i++) {
            $ly = $innerTop + $i * $spacing
            # Shorter last line for natural look
            $x2 = if ($i -eq $linesCount) { $lx1 + [int](($lx2 - $lx1) * 0.65) } else { $lx2 }
            $g.DrawLine($textPen, $lx1, $ly, $x2, $ly)
        }

        # Right page lines
        $rx1 = $mid + [int]($size * 0.07)
        $rx2 = $size - $pad - [int]($size * 0.07)
        for ($i = 1; $i -le $linesCount; $i++) {
            $ly = $innerTop + $i * $spacing
            $x2 = if ($i -eq $linesCount) { $rx1 + [int](($rx2 - $rx1) * 0.65) } else { $rx2 }
            $g.DrawLine($textPen, $rx1, $ly, $x2, $ly)
        }
        $textPen.Dispose()
    }

    $coverPen.Dispose()
    $bgBrush.Dispose()
    $g.Dispose()

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created $outputPath ($size x $size)"
}

# Create all three sizes
Create-CRAIcon -size 16  -outputPath 'F:\chatgpt-enhancement\icons\icon16.png'
Create-CRAIcon -size 48  -outputPath 'F:\chatgpt-enhancement\icons\icon48.png'
Create-CRAIcon -size 128 -outputPath 'F:\chatgpt-enhancement\icons\icon128.png'

# Report file sizes
Get-ChildItem 'F:\chatgpt-enhancement\icons\' | Select-Object Name, Length | Format-Table
Write-Host "Done."
