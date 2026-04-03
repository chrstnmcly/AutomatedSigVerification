import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, Model
from fastapi import FastAPI, UploadFile, File
import uvicorn

app = FastAPI()

def build_base_network(input_shape):
    inputs = layers.Input(shape=input_shape)
    x = layers.Conv2D(64, (10, 10), activation='relu')(inputs)
    x = layers.MaxPooling2D()(x)
    x = layers.Conv2D(128, (7, 7), activation='relu')(x)
    x = layers.MaxPooling2D()(x)
    x = layers.Conv2D(128, (4, 4), activation='relu')(x)
    x = layers.MaxPooling2D()(x)
    x = layers.Conv2D(256, (4, 4), activation='relu')(x)
    x = layers.Flatten()(x)
    x = layers.Dense(4096, activation='sigmoid')(x)
    return Model(inputs, x)

input_shape = (150, 150, 1)
base_network = build_base_network(input_shape)

input_a = layers.Input(shape=input_shape)
input_b = layers.Input(shape=input_shape)

feat_a = base_network(input_a)
feat_b = base_network(input_b)

# Corrected L1 distance logic
distance = layers.Lambda(lambda tensors: tf.abs(tensors[0] - tensors[1]))([feat_a, feat_b])
outputs = layers.Dense(1, activation='sigmoid')(distance)

siamese_model = Model(inputs=[input_a, input_b], outputs=outputs)

def preprocess(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (150, 150))
    img = img.astype("float32") / 255.0
    return img.reshape(150, 150, 1)

@app.post("/compare")
async def compare_signatures(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    img1 = preprocess(await file1.read())
    img2 = preprocess(await file2.read())
    
    # Run prediction
    prediction = siamese_model.predict([np.array([img1]), np.array([img2])])
    similarity = float(prediction[0][0])
    
    return {"similarity": similarity}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
