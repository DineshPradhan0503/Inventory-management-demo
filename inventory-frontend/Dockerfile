FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app .
ENV VITE_API_URL="http://localhost:8080/api"
EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0"]
