@echo off
echo ========================================
echo    Flutter Website to APK Generator
echo ========================================

set APP_NAME=eventify_app
set WEBSITE_PATH=d:\hackspire\Event-Manager-Atreya187-patch-4-Final-Frontend-
set OUTPUT_DIR=d:\APK_Output
set FLUTTER_PATH=D:\flutter\bin\flutter.bat

echo Creating output directory...
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"
cd /d "%OUTPUT_DIR%"

echo Creating Flutter project...
"%FLUTTER_PATH%" create %APP_NAME%
cd %APP_NAME%

echo Project created successfully!
pause

echo Adding webview dependency...
echo webview_flutter: ^4.4.2 >> pubspec.yaml

echo Creating assets folder...
mkdir assets
xcopy "%WEBSITE_PATH%\*" "assets\" /E /Y /I

echo Updating pubspec.yaml...
echo   assets: >> pubspec.yaml
echo     - assets/ >> pubspec.yaml

echo Getting dependencies...
"%FLUTTER_PATH%" pub get

echo Building APK...
"%FLUTTER_PATH%" build apk --release

echo Copying APK...
copy "build\app\outputs\flutter-apk\app-release.apk" "..\%APP_NAME%.apk"

echo ========================================
echo APK created: %OUTPUT_DIR%\%APP_NAME%.apk
echo ========================================
cmd /k