FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install pm2 -g

RUN npm install && npm run build

#COPY dist dist
#COPY .env .

#EXPOSE 4500

COPY . .

CMD ["npm","start"]
