# Face Recognition Service

Servicio de reconocimiento facial para el sistema de asistencia.

## Requisitos

- Python 3.8 o superior
- CMake (para compilar dlib)
- Visual Studio Build Tools (en Windows)

## Instalación

### 1. Instalar dependencias del sistema (Windows)

```bash
# Instalar Visual Studio Build Tools
# Descargar desde: https://visualstudio.microsoft.com/visual-cpp-build-tools/
# Seleccionar "Desarrollo para el escritorio con C++"

# Instalar CMake
# Descargar desde: https://cmake.org/download/
```

### 2. Crear entorno virtual

```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Instalar dependencias Python

```bash
pip install -r requirements.txt
```

## Ejecución

```bash
# Activar entorno virtual
venv\Scripts\activate

# Ejecutar servicio
python main.py
```

El servicio estará disponible en `http://localhost:5000`

## Endpoints

### GET /
Health check

### POST /api/register
Registra imágenes faciales y genera embeddings

**Request:**
```json
{
  "colaborador_id": 1,
  "images": ["base64_image_1", "base64_image_2", ...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully registered 5 face images",
  "embeddings": [[...], [...], ...],
  "quality_scores": [0.9, 0.85, ...]
}
```

### POST /api/recognize
Reconoce un rostro comparándolo con embeddings almacenados

**Request:**
```json
{
  "image": "base64_image",
  "stored_embeddings": [[...], [...], ...]
}
```

**Response:**
```json
{
  "success": true,
  "confidence": 0.95,
  "message": "Face recognition completed",
  "match": true
}
```

### POST /api/validate-image
Valida que una imagen contenga exactamente un rostro

**Request:**
```json
{
  "image": "base64_image"
}
```

**Response:**
```json
{
  "valid": true,
  "message": "Valid face image",
  "faces_count": 1
}
```

## Notas

- El servicio usa el modelo HOG para detección de rostros (más rápido)
- Los embeddings son vectores de 128 dimensiones
- La confianza se calcula como `1 - distance`
- Se recomienda un threshold de 0.85-0.90 para producción
