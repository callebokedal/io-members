# To execute script via Docker

# To install Chrome
#clear && docker run -it --rm --name my-puppeteer node_12 npm install
#clear && docker run -it --rm --name my-puppeteer node_12 npm audit fix

# To run
clear && docker run -it --rm --name my-puppeteer -v "$PWD":/app -w /app node_12 node dist/example.js
    