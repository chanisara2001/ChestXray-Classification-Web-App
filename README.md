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

# Docker Hub
Link : https://hub.docker.com/r/chanisara2001/chest_xray_classifier

Run container:
```
docker run -p 8000:8000 chanisara2001/chest_xray_classifier
```


## License Agreement
This software is a work developed by Mr. Chonsawat Nakanam and Ms. Chanisara Sangsai from Computer Science, Department of Computer Science, College of Computing, Khon Kaen University under the provision of Mr. Thanaphon Tangchoopong under “Multi-label Classification of Lung Diseases from Chest X-Ray Images”, which has been supported by the National Science and Technology Development Agency (NSTDA), in order to encourage pupils and students to learn and practice their skills in developing software. Therefore, the intellectual property of this software shall belong to the developer and the developer gives NSTDA a permission to distribute this software as an “as is” and non-modified software for a temporary and non-exclusive use without remuneration to anyone for his or her own purpose or academic purpose, which are not commercial purposes. In this connection, NSTDA shall not be responsible to the user for taking care, maintaining, training, or developing the efficiency of this software. Moreover, NSTDA shall not be liable for any error, software efficiency, and damages in connection with or arising out of the use of the software.

