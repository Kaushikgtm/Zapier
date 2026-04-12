#1 Base image
FROM node:20-alpine

#2 set working directory
WORKDIR /app

#3 copy package.json file
COPY package*.json ./

#4 Install Dependency
RUN npm install 

#5 copy rest files
COPY . .

# Prisma generate
RUN npx prisma generate

#6 Build typescript
RUN npm run build 

#7 expose port
EXPOSE 3002

#8 Start the app
CMD ["node", "dist/index.js"]