FROM node:22

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY . .
    
RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]