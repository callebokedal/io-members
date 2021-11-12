# Idrott Online - Medlemmar

Detta projekt är för att hantera medlemmar i Idrott Online

## Funktioner

* Exportera medlemmar som Excel-filer

## Information

Bygger på Docker-baserad kod som använder Node, Python med mera.

### Installation

https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix
https://stackoverflow.com/questions/66189600/running-puppeter-inside-docker-container

Idea: https://www.smartjava.org/content/using-puppeteer-in-docker-copy-2/

See
- init_docker.sh

### Exekvering

See
- run_node.sh
- run_docker.sh

```
clear && docker run -it --rm --name my-puppeteer node_12 pwd
clear && docker run -it --rm --name my-puppeteer -v "$PWD":/app node_12 node dist/example.js
```

### Extra

```
Set-Cookie: topbar-login-homepage=https://www.sjovalla.se; path=/
Set-Cookie: topbar-login-appguid=; path=/

...

https://iasidentityservice.idrottonline.se

```