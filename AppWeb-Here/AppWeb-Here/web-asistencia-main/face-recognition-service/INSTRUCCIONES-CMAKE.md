# Instalar CMake para dlib

## Paso 1: Descargar CMake

1. Ve a: https://cmake.org/download/
2. Descarga: **cmake-3.X.X-windows-x86_64.msi** (el instalador .msi)
3. Ejecuta el instalador

## Paso 2: Durante la instalación

**MUY IMPORTANTE:** En la ventana de instalación, selecciona:
- ✅ **"Add CMake to the system PATH for all users"**

  O al menos:
- ✅ **"Add CMake to the system PATH for the current user"**

Esto es CRÍTICO para que dlib pueda encontrar cmake.

## Paso 3: Verificar instalación

1. **Cierra TODAS las terminales/consolas abiertas**
2. Abre una nueva terminal
3. Ejecuta:
   ```
   cmake --version
   ```
4. Deberías ver algo como: `cmake version 3.XX.X`

## Paso 4: Reinstalar dependencias Python

Una vez que cmake esté instalado y en el PATH:

```bash
cd web-asistencia-main\face-recognition-service
install-fix.bat
```

---

## Alternativa: Usar pip install cmake (más rápido)

Si no quieres descargar el instalador, puedes intentar:

```bash
cd web-asistencia-main\face-recognition-service
venv\Scripts\activate
pip install cmake
```

Luego ejecuta de nuevo `install-fix.bat`
