# PowerShell script to compress images recursively
# Uses System.Drawing to resize and compress JPEGs/PNGs

Add-Type -AssemblyName System.Drawing

$sourceDir = "c:\Users\flier\test-git\viajefamiliar30dias\viajefamiliar30dias\public\docs\imagenes"
$maxWidth = 1920
$quality = 70 # JPEG quality 0-100

function Compress-Image {
    param (
        [string]$filePath
    )

    try {
        $image = [System.Drawing.Image]::FromFile($filePath)
        
        # Calculate new dimensions
        $newWidth = $image.Width
        $newHeight = $image.Height

        if ($image.Width -gt $maxWidth) {
            $ratio = $maxWidth / $image.Width
            $newWidth = $maxWidth
            $newHeight = [int]($image.Height * $ratio)
        }

        # Create new bitmap
        $bitmap = new-object System.Drawing.Bitmap $newWidth, $newHeight
        $graph = [System.Drawing.Graphics]::FromImage($bitmap)
        $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        
        # Draw resized image
        $graph.DrawImage($image, 0, 0, $newWidth, $newHeight)
        
        # Set encryption parameters (Quality)
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)

        # Dispose original to release lock so we can overwrite
        $image.Dispose()

        # Save to temp file then replace
        $tempFile = $filePath + ".tmp.jpg"
        $bitmap.Save($tempFile, $codec, $encParams)
        
        # Cleanup
        $bitmap.Dispose()
        $graph.Dispose()

        # Overwrite original
        Remove-Item $filePath -Force
        Move-Item $tempFile $filePath -Force
        
        Write-Host "Compressed: $filePath"
    }
    catch {
        Write-Error "Failed to compress $filePath : $_"
        if ($image) { $image.Dispose() }
    }
}

# Recursively process files
Get-ChildItem -Path $sourceDir -Recurse -Include *.jpg, *.jpeg, *.png | ForEach-Object {
    $file = $_.FullName
    Write-Host "Processing: $file"
    Compress-Image -filePath $file
}

Write-Host "Compression Complete!"
