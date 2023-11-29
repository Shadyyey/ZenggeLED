# Zengge
This project is a completely restructured version of my friends old [ELK-BLEDOM-RECODE](https://github.com/Amenofisch/ELK-BLEDOM-RECODE)-named repository.
It basically has the same features although this version supports multiple LED Strips to be used with a single instance of this software and it supports a different type of LED Strips called Zengge.
Spotify Functionality is going to be added soon as well.

## Endpoints
See api-spec.yml using a OpenAPI Editor (https://editor.swagger.io/ <-- copy and paste the file into there)

## Basic Setup
The installation steps are pretty much the same as with the old version.

1. Edit config.js to your needs (Don't forget to adjust the devices)
2. Install gatttool (`sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev`)
3. Install nodejs (there are plenty of tutorials on the internet)
4. (optional but recommended) Install pm2 `npm install -g pm2`
5. Install all neccessary packages using `npm i`
6. Start the project either using pm2 (`pm2 start index.js`) or using nodejs (`node index.js`)
