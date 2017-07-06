$libDir = Get-Item "lib\"

$releaseDir  = "release\"
New-Item -Path $releaseDir -ItemType Directory -Force

$assetsRelease = $releaseDir + "assets\"
New-Item -Path $assetsRelease -ItemType Directory -Force

$isDebug = $True;
$genSpriteSheets = $True;
$minfiedOutput = $releaseDir + "game.min.js"
$debugHtml = $releaseDir + "debug.html"
$releaseHtml = $releaseDir + "index.html"
$assetsDir = "assets\"
$assetFiles = Get-Item $assetsDir

grunt

Copy-Item "lib\phaser.min.js" "$releaseDir\phaser.min.js" -Force
Copy-Item "lib\webfonts.js" "$releaseDir\webfonts.js" -Force

if ($genSpriteSheets){
    .".\gen-sprite-sheet.ps1"
    Write-Host "Generating Sprite Sheets"
    generateSpriteSheets "png" "fly.png" $True $True 1
    generateSpriteSheets "gif" "preloader.png" $False  $False 1
    generateSpriteSheets "png" "play_btn.png" $False  $True 1
    generateSpriteSheets "png" "close_btn.png" $False  $True 1
}

$fileNameConventionsPrioritised = @(
    'GAME_BG.jpg',
    'close_btn.png',
    'play_btn.png',
    'cursor.png',
    'scoreboard.png',
    'scoreboard_heading.png',
    'bar.png',
    'scroll.png',
    'scroll_item.png'
);
foreach ($convention in $fileNameConventionsPrioritised) {
    foreach ($item in $assetFiles.GetFiles($convention,"AllDirectories")) {
        Write-Host "Copying $item"
        $destination = $assetsRelease + $item.Name
        $destination = $destination.replace('apps','Apps').replace('azure','Azure')
        $source = $item.FullName.replace('apps','Apps').replace('azure','Azure')
        Copy-Item $source $destination -Force
    }
}

if ($isDebug){
    $html = '<html>
                    <head>
                        <title></title>
                        <script type="text/javascript" src="phaser.min.js"></script>
                       
                    </head>
                    <body style="cursor: none;">
                      #
                    </body>
                </html>';

    foreach($file in $libDir.GetFiles("utility.js","AllDirectories")) {
        $filePath = Resolve-Path -Path $file.FullName
        [string]$script = "<script type=""text/javascript"" src=""$filePath""></script>
                   #";
        $html = $html.replace('#',$script)
    }

    foreach($file in $libDir.GetFiles("events.js","AllDirectories")) {
        $filePath = Resolve-Path -Path $file.FullName;
        [string]$script = "<script type=""text/javascript"" src=""$filePath""></script>
                   #";
        $html = $html.replace('#',$script)
    }
    
    foreach($file in $libDir.GetFiles("config.js","AllDirectories")) {
        $filePath = Resolve-Path -Path $file.FullName;
        [string]$script = "<script type=""text/javascript"" src=""$filePath""></script>
                   #";
        $html = $html.replace('#',$script)
    }
    
    foreach($file in $libDir.GetFiles("*Factory.js","AllDirectories")) {
        $filePath = Resolve-Path -Path $file.FullName;
        [string]$script = "<script type=""text/javascript"" src=""$filePath""></script>
                   #";
        $html = $html.replace('#',$script)
    }

     foreach($file in $libDir.GetFiles("*Manager.js","AllDirectories")) {
        $filePath = Resolve-Path -Path $file.FullName;
        [string]$script = "<script type=""text/javascript"" src=""$filePath""></script>
                   #";
        $html = $html.replace('#',$script)
    }

    foreach($file in $libDir.GetFiles("*.js","AllDirectories")) {
        if (!$file.Name.Contains('utility') -And !$file.Name.Contains('Factory') -And !$file.Name.Contains('Manager') -And !$file.Name.Contains('events') -And !$file.Name.Contains('config')){
            $filePath = Resolve-Path -Path $file.FullName;
            [string]$script = "<script type=""text/javascript"" src=""$filePath""></script>
                       #";
            $html = $html.replace('#',$script)
        }
    }
    $html = $html.replace('#','<script type="text/javascript" src="webfonts.js"></script>')

    #DEBUG
    New-Item $debugHtml -value $html -type file -Force
}else{
    $html = '<html>
                    <head>
                        <title></title>
                        <script type="text/javascript" src="phaser.min.js"></script>
                     
                        <script type="text/javascript" src="webfonts.js"></script>
                    </head>
                    <body style="cursor: none;">
                       <script type="text/javascript" src="game.min.js"></script>
                    </body>
                </html>';
    #RELEASE
    New-Item $releaseHtml -value $html -type file -Force
}
Exit