@echo off
echo Starting test...
pause
echo Testing Flutter path...
pause
set FLUTTER_PATH=D:\flutter\bin\flutter.bat
echo Flutter path is: %FLUTTER_PATH%
pause
echo Checking if file exists...
if exist "%FLUTTER_PATH%" (
    echo Flutter file found!
) else (
    echo Flutter file NOT found!
)
pause
echo End of test
cmd /k