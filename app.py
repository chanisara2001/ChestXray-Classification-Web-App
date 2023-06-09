from fastapi import FastAPI, Request, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import tensorflow as tf
import numpy as np
import cv2
import base64


app = FastAPI()

# Load the predictive model
model = tf.keras.models.load_model('model/EfficientNetB0.h5')

LABELS = ['No Finding', 'Atelectasis', 'Consolidation', 'Infiltration', 'Pneumothorax', 'Edema', 'Emphysema',
          'Fibrosis', 'Effusion', 'Pneumonia', 'Pleural Thickening', 'Cardiomegaly', 'Nodule', 'Mass', 'Hernia']

# Define a function to preprocess the image


def preprocess_image(img):
    img = cv2.resize(img, (224, 224))
    img = np.array(img, dtype=np.float32)
    img = np.expand_dims(img, axis=0)
    return img


def img_to_base64(img):
    img_buffer = cv2.imencode('.png', img)[1]
    img_base64 = base64.b64encode(img_buffer.tobytes()).decode('utf-8')
    return f'data:image/png;base64,{img_base64}'


# Mount the static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Load the templates directory
templates = Jinja2Templates(directory="templates")


@app.get('/', response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("home.html", {"request": request, "active_page": "home"})


@app.get("/contact", response_class=HTMLResponse)
async def contact(request: Request):
    return templates.TemplateResponse("contact.html", {"request": request, "active_page": "contact"})


@app.get("/condition", response_class=HTMLResponse)
async def condition(request: Request):
    return templates.TemplateResponse("condition.html", {"request": request, "active_page": "condition"})


@app.post('/predict/')
async def predict(request: Request, image: UploadFile = File()):
    contents = await image.read()

    # Read the uploaded image
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    input_image_data_url = img_to_base64(img)

    # Preprocess the image
    img = preprocess_image(img)

    # Make a prediction using the model
    prediction = model.predict(img)

    probabilities = prediction[0]
    percentages = probabilities * 100

    result = {label: f'{prob:.2f}' for (
        label, prob) in zip(LABELS, percentages)}

    # sort percent_result by value
    result = dict(sorted(result.items(),
                         key=lambda item: float(item[1]), reverse=True))

    return templates.TemplateResponse("result.html", {"request": request, 'results': result, 'input_image_data_url': input_image_data_url})
