from node:20-alpine

WORKDIR /app


COPY package*.json ./
RUN npm ci


COPY . .

EXPOSE 5173

CMD ["npm", "run", "preview","dev", "--", "--host"]