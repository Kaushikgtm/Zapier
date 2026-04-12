#1 Base image
FROM node:20-alpine

#2 set working directory
WORKDIR /app

#3 copy package.json file
COPY package*.json ./

#4 Install dependency
RUN npm install

#5 copy rest file
COPY . . 

# Prisma generate
RUN npx prisma generate

#6 Build typescript
RUN npx tsc -b

#7 expose port
EXPOSE 3000

#8 Start the app
CMD ["node", "dist/index.js"]
