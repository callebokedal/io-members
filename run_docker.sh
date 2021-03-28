# To execute script via Docker

clear && docker run -it --rm --name my-login -v "$PWD":/usr/src/app -w /usr/src/app node-latest \
    node login.js
    