Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$store = Join-Path $root 'store-assets'
New-Item -ItemType Directory -Force -Path $store | Out-Null

function New-Dir($p) { New-Item -ItemType Directory -Force -Path $p | Out-Null }
function Save-Icon($path, [int]$size, [bool]$round = $false) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::FromArgb(14, 44, 74))

    $rect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.Color]::FromArgb(13, 57, 94)), ([System.Drawing.Color]::FromArgb(36, 128, 170)), 45
    $g.FillRectangle($brush, $rect)

    $gold = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(245, 179, 45))
    $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $muted = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(224, 241, 248))
    $penGold = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(245, 179, 45)), ([Math]::Max(3, $size * 0.025))
    $penWhite = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), ([Math]::Max(3, $size * 0.018))
    $penWhite.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penWhite.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    # Rounded badge/card
    $margin = [int]($size * 0.13)
    $card = New-Object System.Drawing.Rectangle $margin, $margin, ($size - 2*$margin), ($size - 2*$margin)
    $radius = [int]($size * 0.12)
    $path2 = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = 2*$radius
    $path2.AddArc($card.X, $card.Y, $d, $d, 180, 90)
    $path2.AddArc($card.Right-$d, $card.Y, $d, $d, 270, 90)
    $path2.AddArc($card.Right-$d, $card.Bottom-$d, $d, $d, 0, 90)
    $path2.AddArc($card.X, $card.Bottom-$d, $d, $d, 90, 90)
    $path2.CloseFigure()
    $overlay = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(42, 255, 255, 255))
    $g.FillPath($overlay, $path2)
    $g.DrawPath($penGold, $path2)

    # EIE text
    $fontSize = [Math]::Max(12, $size * 0.22)
    $font = New-Object System.Drawing.Font 'Arial', $fontSize, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $textRect = New-Object System.Drawing.RectangleF 0, ($size*0.23), $size, ($size*0.28)
    $g.DrawString('EIE', $font, $white, $textRect, $sf)

    # Simple vehicle + document line art
    $y = [int]($size * 0.64)
    $x1 = [int]($size * 0.27); $x2 = [int]($size * 0.73)
    $g.DrawLine($penWhite, $x1, $y, $x2, $y)
    $g.DrawArc($penWhite, [int]($size*0.34), [int]($size*0.50), [int]($size*0.32), [int]($size*0.20), 190, 160)
    $wheel = [int]($size * 0.055)
    $g.FillEllipse($gold, [int]($size*0.33), [int]($size*0.61), $wheel, $wheel)
    $g.FillEllipse($gold, [int]($size*0.61), [int]($size*0.61), $wheel, $wheel)

    # Preserve transparent rounded icon masks only for round output.
    if ($round) {
      $masked = New-Object System.Drawing.Bitmap $size, $size
      $mg = [System.Drawing.Graphics]::FromImage($masked)
      $mg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
      $mg.Clear([System.Drawing.Color]::Transparent)
      $circlePath = New-Object System.Drawing.Drawing2D.GraphicsPath
      $circlePath.AddEllipse(0,0,$size,$size)
      $mg.SetClip($circlePath)
      $mg.DrawImage($bmp,0,0,$size,$size)
      $masked.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
      $mg.Dispose(); $masked.Dispose()
    } else {
      $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    $g.Dispose(); $bmp.Dispose()
}

function Save-Splash($path, [int]$w, [int]$h) {
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $rect = New-Object System.Drawing.Rectangle 0,0,$w,$h
    $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.Color]::FromArgb(11, 42, 70)), ([System.Drawing.Color]::FromArgb(30, 109, 148)), 90
    $g.FillRectangle($bg, $rect)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $gold = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(245, 179, 45))
    $fontLogo = New-Object System.Drawing.Font 'Arial', ([Math]::Max(60, [int]($w*0.16))), ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
    $fontTag = New-Object System.Drawing.Font 'Arial', ([Math]::Max(28, [int]($w*0.045))), ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('EIE', $fontLogo, $white, (New-Object System.Drawing.RectangleF 0, ($h*0.35), $w, ($h*0.16)), $sf)
    $g.DrawString('Auto Registration', $fontTag, $gold, (New-Object System.Drawing.RectangleF 0, ($h*0.49), $w, ($h*0.08)), $sf)
    $g.DrawString('Service requests made simple', $fontTag, $white, (New-Object System.Drawing.RectangleF 0, ($h*0.56), $w, ($h*0.08)), $sf)
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# Store-level assets
Save-Icon (Join-Path $store 'app-icon-1024.png') 1024 $false
Save-Splash (Join-Path $store 'splash-ios-1290x2796.png') 1290 2796
Save-Splash (Join-Path $store 'splash-android-1080x1920.png') 1080 1920
Save-Splash (Join-Path $store 'splash-tablet-2048x2732.png') 2048 2732

# Android launcher icons
$densitySizes = @{ 'mipmap-mdpi'=48; 'mipmap-hdpi'=72; 'mipmap-xhdpi'=96; 'mipmap-xxhdpi'=144; 'mipmap-xxxhdpi'=192 }
foreach ($kv in $densitySizes.GetEnumerator()) {
  $dir = Join-Path $root "android/app/src/main/res/$($kv.Key)"
  New-Dir $dir
  Save-Icon (Join-Path $dir 'ic_launcher.png') $kv.Value $false
  Save-Icon (Join-Path $dir 'ic_launcher_round.png') $kv.Value $true
}

# iOS icon set
$iosDir = Join-Path $root 'ios/EIECustomerMobileApp/Images.xcassets/AppIcon.appiconset'
New-Dir $iosDir
$iosImages = @(
  @{ idiom='iphone'; size='20x20'; scale='2x'; px=40 },
  @{ idiom='iphone'; size='20x20'; scale='3x'; px=60 },
  @{ idiom='iphone'; size='29x29'; scale='2x'; px=58 },
  @{ idiom='iphone'; size='29x29'; scale='3x'; px=87 },
  @{ idiom='iphone'; size='40x40'; scale='2x'; px=80 },
  @{ idiom='iphone'; size='40x40'; scale='3x'; px=120 },
  @{ idiom='iphone'; size='60x60'; scale='2x'; px=120 },
  @{ idiom='iphone'; size='60x60'; scale='3x'; px=180 },
  @{ idiom='ios-marketing'; size='1024x1024'; scale='1x'; px=1024 }
)
$contentImages = @()
foreach ($img in $iosImages) {
  $filename = "AppIcon-$($img.px).png"
  Save-Icon (Join-Path $iosDir $filename) ([int]$img.px) $false
  $contentImages += [ordered]@{ idiom=$img.idiom; size=$img.size; scale=$img.scale; filename=$filename }
}
$contents = [ordered]@{ images=$contentImages; info=[ordered]@{ author='xcode'; version=1 } }
$contents | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 (Join-Path $iosDir 'Contents.json')

Write-Host "Generated app icons and splash screens in $store and native asset folders."
