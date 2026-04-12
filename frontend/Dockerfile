#1 Base Image
FROM node:20-alpine

#2 Set Working Directory
WORKDIR /app

#3 Copy package.json file
COPY package*.json ./

#4 Install Dependency 
RUN npm install

#5 Copy rest file
COPY . .

#6 Build typescript
RUN npm run build

#7 Expose Port
ENV PORT=3001
EXPOSE 3001

#8 Start the app
CMD ["npm", "run", "start"]