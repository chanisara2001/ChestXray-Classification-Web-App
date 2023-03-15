# ChestXray-Classification-Web-App

## Download the Model
You can download the model at https://drive.google.com/drive/folders/1pqp8QPqDeeg-gaYKWXd7bLpWybGla2sE?usp=share_link

Then create a folder "model" and move model files (.h5) to here.

## Create an Environment
Open new terminal for the following steps:
1. Create the environment from the environment.yml file: ``` conda env create -f environment.yml ```

When you run ``` conda env list ``` your terminal should be:
```
# conda environments:
#
web_img_predict          /File Directory/
```

2. Activate the new environment: ``` conda activate web_img_predict ```

More Detail: https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html

## Run Server
Run the live server by command:
``` uvicorn app:app --reload ```

In the output terminal should be:

``` INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit) ```

Open your browser at http://127.0.0.1:8000

More Detail: https://fastapi.tiangolo.com/tutorial/first-steps/
