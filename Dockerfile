FROM node

WORKDIR /covid-bot

COPY . .
COPY src/services src/services

RUN npm install

EXPOSE 3000

CMD ["node", "src/index.js"]