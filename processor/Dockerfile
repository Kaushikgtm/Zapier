#1 Base image
FROM node:20-alpine

#2 WORKING dir
WORKDIR /app

#3 copy package.json file
COPY package*.json ./

#4 Install dependency
RUN npm install

#5 copy rest file
COPY . .

#6 Generate Prisma client
RUN npx prisma generate

#7 typescript run
RUN npm run build

# start the app
CMD ["node", "dist/index.js"]
