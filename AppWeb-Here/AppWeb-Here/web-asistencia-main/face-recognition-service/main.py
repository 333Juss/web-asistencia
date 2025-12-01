from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import face_recognition
import numpy as np
import base64
import io
from PIL import Image
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Face Recognition Service", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de datos
class ImageData(BaseModel):
    image: str  # Base64 encoded image

class RegisterRequest(BaseModel):
    colaborador_id: int
    images: List[str]  # Lista de imágenes en base64

class RegisterResponse(BaseModel):
    success: bool
    message: str
    embeddings: List[List[float]]
    quality_scores: List[float]

class RecognizeRequest(BaseModel):
    image: str  # Base64 encoded image
    stored_embeddings: List[List[float]]  # Embeddings almacenados en BD

class RecognizeResponse(BaseModel):
    success: bool
    confidence: float
    message: str
    match: bool

# Funciones auxiliares
def base64_to_image(base64_string: str) -> np.ndarray:
    """Convierte imagen base64 a array numpy"""
    try:
        # Remover prefijo data:image si existe
        if 'base64,' in base64_string:
            base64_string = base64_string.split('base64,')[1]

        # Decodificar base64
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))

        # Convertir a RGB si es necesario
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Convertir a numpy array
        return np.array(image)
    except Exception as e:
        logger.error(f"Error converting base64 to image: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

def calculate_image_quality(face_encoding: np.ndarray, image: np.ndarray) -> float:
    """
    Calcula la calidad de la imagen facial basándose en varios factores
    Retorna un valor entre 0 y 1
    """
    quality_score = 1.0

    # Factor 1: Tamaño de la imagen
    height, width = image.shape[:2]
    if width < 200 or height < 200:
        quality_score *= 0.5
    elif width < 400 or height < 400:
        quality_score *= 0.8

    # Factor 2: Brillo (evitar imágenes muy oscuras o muy claras)
    brightness = np.mean(image)
    if brightness < 50 or brightness > 200:
        quality_score *= 0.7

    return round(quality_score, 2)

@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "service": "Face Recognition Service",
        "status": "running",
        "version": "1.0.0"
    }

@app.post("/api/register", response_model=RegisterResponse)
async def register_face(request: RegisterRequest):
    """
    Registra múltiples imágenes faciales y genera embeddings
    """
    try:
        logger.info(f"Registering faces for colaborador_id: {request.colaborador_id}")

        if not request.images or len(request.images) == 0:
            raise HTTPException(status_code=400, detail="No images provided")

        if len(request.images) > 5:
            raise HTTPException(status_code=400, detail="Maximum 5 images allowed")

        embeddings = []
        quality_scores = []

        for idx, img_base64 in enumerate(request.images):
            # Convertir base64 a imagen
            image = base64_to_image(img_base64)

            # Detectar rostros en la imagen
            face_locations = face_recognition.face_locations(image, model="hog")

            if len(face_locations) == 0:
                logger.warning(f"No face detected in image {idx + 1}")
                raise HTTPException(
                    status_code=400,
                    detail=f"No face detected in image {idx + 1}. Please ensure your face is clearly visible."
                )

            if len(face_locations) > 1:
                logger.warning(f"Multiple faces detected in image {idx + 1}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Multiple faces detected in image {idx + 1}. Please ensure only one person is in the photo."
                )

            # Generar embedding (128 dimensiones)
            face_encodings = face_recognition.face_encodings(image, face_locations)

            if len(face_encodings) == 0:
                raise HTTPException(
                    status_code=400,
                    detail=f"Could not generate face encoding for image {idx + 1}"
                )

            face_encoding = face_encodings[0]

            # Calcular calidad de la imagen
            quality = calculate_image_quality(face_encoding, image)

            # Almacenar embedding y calidad
            embeddings.append(face_encoding.tolist())
            quality_scores.append(quality)

            logger.info(f"Image {idx + 1} processed successfully. Quality: {quality}")

        logger.info(f"Successfully registered {len(embeddings)} faces")

        return RegisterResponse(
            success=True,
            message=f"Successfully registered {len(embeddings)} face images",
            embeddings=embeddings,
            quality_scores=quality_scores
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in register_face: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/recognize", response_model=RecognizeResponse)
async def recognize_face(request: RecognizeRequest):
    """
    Reconoce un rostro comparándolo con embeddings almacenados
    """
    try:
        logger.info("Starting face recognition")

        if not request.stored_embeddings or len(request.stored_embeddings) == 0:
            raise HTTPException(
                status_code=400,
                detail="No stored embeddings provided. User must register first."
            )

        # Convertir imagen a numpy array
        image = base64_to_image(request.image)

        # Detectar rostros
        face_locations = face_recognition.face_locations(image, model="hog")

        if len(face_locations) == 0:
            logger.warning("No face detected in recognition attempt")
            return RecognizeResponse(
                success=False,
                confidence=0.0,
                message="No face detected in the image",
                match=False
            )

        if len(face_locations) > 1:
            logger.warning("Multiple faces detected in recognition attempt")
            return RecognizeResponse(
                success=False,
                confidence=0.0,
                message="Multiple faces detected. Please ensure only one person is visible.",
                match=False
            )

        # Generar embedding de la imagen actual
        face_encodings = face_recognition.face_encodings(image, face_locations)

        if len(face_encodings) == 0:
            return RecognizeResponse(
                success=False,
                confidence=0.0,
                message="Could not generate face encoding",
                match=False
            )

        current_encoding = face_encodings[0]

        # Convertir embeddings almacenados a numpy arrays
        stored_encodings = [np.array(emb) for emb in request.stored_embeddings]

        # Comparar con todos los embeddings almacenados
        face_distances = face_recognition.face_distance(stored_encodings, current_encoding)

        # Obtener la mejor coincidencia
        best_match_index = np.argmin(face_distances)
        best_distance = face_distances[best_match_index]

        # Convertir distancia a confianza (0 = idéntico, 1 = muy diferente)
        # Fórmula: confidence = 1 - distance
        confidence = 1.0 - best_distance
        confidence = max(0.0, min(1.0, confidence))  # Clamp entre 0 y 1

        # Threshold de 0.6 de distancia (equivale a ~0.4 de confianza mínima)
        # Pero devolvemos el valor para que el backend decida con su threshold
        tolerance = 0.6
        match = best_distance < tolerance

        logger.info(f"Recognition result - Distance: {best_distance:.3f}, Confidence: {confidence:.3f}, Match: {match}")

        return RecognizeResponse(
            success=True,
            confidence=round(confidence, 3),
            message=f"Face recognition completed. Best match distance: {best_distance:.3f}",
            match=match
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in recognize_face: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/validate-image")
async def validate_image(request: ImageData):
    """
    Valida que una imagen contenga exactamente un rostro
    """
    try:
        image = base64_to_image(request.image)
        face_locations = face_recognition.face_locations(image, model="hog")

        if len(face_locations) == 0:
            return {
                "valid": False,
                "message": "No face detected",
                "faces_count": 0
            }

        if len(face_locations) > 1:
            return {
                "valid": False,
                "message": f"Multiple faces detected ({len(face_locations)})",
                "faces_count": len(face_locations)
            }

        return {
            "valid": True,
            "message": "Valid face image",
            "faces_count": 1
        }

    except Exception as e:
        logger.error(f"Error validating image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Validation error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000, log_level="info")
