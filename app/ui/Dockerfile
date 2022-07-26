FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
RUN cp -p node_modules/@elastic/eui/dist/eui_theme_dark.css node_modules/@elastic/eui/dist/eui_theme_light.css public/
EXPOSE 3000
CMD [ "yarn", "start" ]