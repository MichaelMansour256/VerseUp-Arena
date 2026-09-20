$source = 'C:\Users\Seham\verseup\VerseUp-Arena\assets\images\logo.png'
$destDir = 'C:\Users\Seham\verseup\VerseUp-Arena\assets\icons'

if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }

# 192x192
convert $source -resize 192x192 -background '#0d1b2e' -gravity center -extent 192x192 -quality 90 $destDir\pwa-192x192.png

# 512x512
convert $source -resize 512x512 -background '#0d1b2e' -gravity center -extent 512x512 -quality 90 $destDir\pwa-512x512.png

# 512x512 maskable (transparent background)
convert $source -resize 512x512 -background none -gravity center -extent 512x512 -quality 90 $destDir\pwa-512x512-maskable.png

Write-Host 'Icons created:'
Get-ChildItem $destDir -Filter 'pwa-*' | ForEach-Object { Write-Host "  - $_" }
