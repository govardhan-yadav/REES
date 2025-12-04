@echo off
echo ========================================
echo    STARTING TEACHER QUIZ SYSTEM
echo ========================================
echo.
echo Starting server...
start "Server" cmd /k "npm start"
timeout /t 3 /nobreak >nul
echo.
echo Opening Teacher Login...
start teacher-login.html
echo.
echo Opening Student Quiz Portal...
start student-quiz.html
echo.
echo ========================================
echo    SYSTEM READY!
echo ========================================
echo.
echo Teacher Login: teacher-login.html
echo Student Quiz: student-quiz.html
echo.
pause