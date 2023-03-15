from fastapi import FastAPI, Request, Form, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image

app = FastAPI()

# Load the predictive model
model = tf.keras.models.load_model('model/EfficientNetB0.h5')

LABELS = ['No Finding', 'Atelectasis', 'Consolidation', 'Infiltration', 'Pneumothorax', 'Edema', 'Emphysema', 'Fibrosis', 'Effusion', 'Pneumonia', 'Pleural_Thickening', 'Cardiomegaly', 'Nodule', 'Mass', 'Hernia']

# Define a function to preprocess the image
def preprocess_image(img):
    img = cv2.resize(img, (224, 224))
    img = np.array(img, dtype=np.float32)
    # img = img / 255.0
    cv2.imwrite('static/output.jpg', img)
    img = np.expand_dims(img, axis=0)
    return img

# Mount the static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Load the templates directory
templates = Jinja2Templates(directory="templates")

@app.get('/')
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post('/predict/')
async def predict(request: Request, image: UploadFile = File()):

    contents = await image.read()

    # Read the uploaded image
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    cv2.imwrite('static/input.jpg', img)

    print(img.shape)

    # Preprocess the image
    img = preprocess_image(img)
    print(img.shape)

    # Make a prediction using the model
    prediction = model.predict(img)

    percent_result = {l:f'{v*100:.2f}' for (l,v) in zip(LABELS, prediction[0])}

    # sort percent_result by value
    percent_result = dict(sorted(percent_result.items(), key=lambda item: float(item[1]), reverse=True))

    
    return templates.TemplateResponse("predict.html", {"request": request,'percent_results':percent_result,'image_url':'/static/output.jpg'})
