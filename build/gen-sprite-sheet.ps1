$releaseDir  = "release\"
$assetsRelease = $releaseDir + "assets\"
$assetsDir = "assets\"

function generateSpriteSheets ([string]$extension, $spriteSheetName, $resize, $alphaOn, [int]$nameIndex) {
    [string]$temp = "$assetsDir" + "temp"
    New-Item $temp -Type Directory -Force
    [string]$dir = $spriteSheetName.Split('.')[0]
    [string]$dir =  "assets\$dir"
    [string]$expression = "$dir\*.$extension"
    [string]$tempFiles = "$temp\*.$extension"
    #Write-Host "expression: $expression"

    $assetFileNames = new-object System.Collections.ArrayList
    Get-Item $expression | Select-Object {
        $assetFileNames.Add($_.Name)
    } | Out-Null

    [string[]]$assetFileNames = $assetFileNames
    
    [string]$commandParams = ""
    $count = $assetFileNames.count
    [string[]]$orderedFiles = new-object string[] $count
    #Write-Host "count:  $count"
    $arrayNumbers = new-object int[] $count
    for([int]$i =0; $i -lt $count; $i++){
        [string]$file = $assetFileNames[$i]
        [int]$fileNum = $file.Replace(".gif","").Replace(".png","").Split("_")[$nameIndex]
        $arrayNumbers[$i] = $fileNum 
    }
    [array]::sort($arrayNumbers)
    #Write-Host "arrayNumbers:  $arrayNumbers"
    for([int]$i =0; $i -lt $count; $i++){
        [int]$fileNum = $arrayNumbers[$i]
        
        #locate file
        for([int]$x =0; $x -lt $count; $x++) {
            [string]$file = $assetFileNames[$x]
            [int]$expectedFileNum = $file.Replace(".gif","").Replace(".png","").Split("_")[$nameIndex]
            if ($fileNum -eq $expectedFileNum){
                #CREATE FILE SO THAT WE CAN DO A SORT ON CREATION DATE
                $orderedFiles[$i] = $file
                break
            }
        }
    }

    for([int]$x =0; $x -lt $count; $x++) {
        $file = $orderedFiles[$x];
        [int]$fileNum = $file.Replace(".gif","").Replace(".png","").Split("_")[$nameIndex]
        #Write-Host "Sored File:$file"
        Copy-Item "$dir\$file" "$temp\$fileNum.$extension" -Force
        Start-Sleep -m 100
    }

    $assetFileNames = Get-Item $tempFiles | Sort-Object -Property CreationTime | Select-Object $_.Name
    foreach($fileName in $assetFileNames){
        #Write-Host $fileName
        $commandParams = "$commandParams $fileName"
        $expression =  "convert $fileName  $fileName"
        invoke-expression $expression
        if ($resize -eq $true){ 

            $expression =  "mogrify $fileName -gravity west -chop 200x0 +repage $fileName"
            invoke-expression $expression

            $expression =  "mogrify $fileName -gravity east -chop 200x0 +repage $fileName"
            invoke-expression $expression

            $expression =  "mogrify $fileName -gravity north -chop 0x100 +repage $fileName"
            invoke-expression $expression

            $expression =  "mogrify $fileName -gravity south -chop 0x100 +repage $fileName"
            invoke-expression $expression

            $expression =  "convert $fileName -resize 128x128^ $fileName"
            invoke-expression $expression
        }
    }

    #Write-Host "outputFile: $commandParams"
    
    $outputFile = "$assetsRelease$spriteSheetName"

    if ($alphaOn -eq $True){
        $expression =  "montage -alpha Set -background none -border 0 -geometry +0+0 $commandParams $outputFile"
        invoke-expression $expression
    }else{
        $expression =  "montage -border 0 -geometry +0+0 $commandParams $outputFile"
        invoke-expression $expression
    }

    Remove-Item $temp -Force -Recurse
}