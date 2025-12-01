@echo off
echo Activating virtual environment...
call venv\Scripts\activate

echo Starting Face Recognition Service...
python main.py

pause
