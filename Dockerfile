# Use an official Python runtime as a parent image
FROM tensorflow/tensorflow:latest-gpu

# Set the working directory to /app
WORKDIR /app
 
RUN apt-get update && apt-get install -y numactl

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Expose port 8000 for the application
EXPOSE 8000

# Define an environment variable for the model file path
ENV MODEL_FILEPATH="model/EfficientNetB0.h5"

# Define a command to run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]