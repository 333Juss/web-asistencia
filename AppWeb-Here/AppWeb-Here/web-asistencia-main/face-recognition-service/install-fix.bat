@echo off
echo ========================================
echo Instalacion Mejorada - Face Recognition
echo ========================================
echo.

REM Eliminar entorno anterior si existe
if exist venv (
    echo Eliminando entorno virtual anterior...
    rmdir /s /q venv
)

echo Creando nuevo entorno virtual...
python -m venv venv

echo Activando entorno virtual...
call venv\Scripts\activate

echo.
echo Actualizando pip, setuptools y wheel...
python -m pip install --upgrade pip setuptools wheel

echo.
echo ========================================
echo Instalando dependencias en orden correcto...
echo ========================================
echo.

echo [1/9] Instalando numpy (puede tardar)...
pip install numpy

echo [2/9] Instalando Pillow...
pip install Pillow

echo [3/9] Instalando requests...
pip install requests

echo [4/9] Instalando pydantic...
pip install pydantic==2.5.0

echo [5/9] Instalando python-multipart...
pip install python-multipart

echo [6/9] Instalando opencv-python (puede tardar)...
pip install opencv-python

echo [7/9] Instalando dlib (PUEDE TARDAR MUCHO - dependencia de face_recognition)...
echo NOTA: Si falla aqui, necesitas Visual Studio Build Tools
pip install dlib

echo [8/9] Instalando face-recognition...
pip install face-recognition

echo [9/9] Instalando FastAPI y Uvicorn...
pip install fastapi==0.104.1
pip install uvicorn==0.24.0

echo.
echo ========================================
echo Verificando instalacion...
echo ========================================
python -c "import fastapi; import face_recognition; import cv2; print('✓ Todas las dependencias instaladas correctamente!')"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ INSTALACION EXITOSA
    echo ========================================
    echo.
    echo Para ejecutar el servicio, usa: run.bat
) else (
    echo.
    echo ========================================
    echo ✗ ERROR EN LA INSTALACION
    echo ========================================
    echo.
    echo Si dlib fallo, necesitas instalar:
    echo 1. Visual Studio Build Tools
    echo    https://visualstudio.microsoft.com/visual-cpp-build-tools/
    echo 2. Reinicia la terminal y vuelve a ejecutar este script
)

echo.
pause
