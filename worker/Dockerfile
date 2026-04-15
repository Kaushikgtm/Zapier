#1 Base image
FROM node:20-alpine

#2 Set Working Directory
WORKDIR /app

#3 copy package.json file
COPY package*.json ./

#4 Install dependency
RUN npm install 

#5 copy rest file
COPY . .

#6 Prisma generate
RUN npx prisma generate

#7 build typescript
RUN npm run build

#7 start the app
CMD ["node", "dist/index.js"] 
