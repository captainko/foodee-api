FROM node:10

WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install

COPY dist dist
COPY .env .

EXPOSE 4500

CMD ["node","./dist/index.js"]