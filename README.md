# trivial-compute

# How to Start
`npm i`: install all the dependencies <br>
`npm start`: Starts the server
npm install axios: added package
# Testing Webpage
[localhost:8080](localhost:8080)

# Versions 
node: v20.15.0 LTS <br>
npm: 10.7.0

# Environment Setup
Setup assumes you have Docker installed. If you do not, please follow the instructions on Docker's site for installation on your platform: https://docs.docker.com/guides/getting-started/get-docker-desktop/

Once you have Docker, please first pull our Docker image from your command line:

`docker pull eltonwang1594/my-web-app:v1`

Then, run the container from within the command line:

`docker run --name trivial-compute --rm --platform linux/arm64/v8 -p 8080:8080 eltonwang1594/my-web-app:v1 npm start`

Wait for the message "Server running on port 8080..." to appear.
Then access the GUI at this link using your web browser:
`http://localhost:8080`

