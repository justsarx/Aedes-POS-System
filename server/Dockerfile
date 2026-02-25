FROM node:18-slim

# Install Oracle Instant Client dependencies
RUN apt-get update && apt-get install -y libaio1 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
