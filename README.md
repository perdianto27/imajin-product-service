## 🚀 Getting Started

```bash
# Setup environment
cp .env.example .env

# Pilih versi Node.js
nvm use 22.12.0

# Install dependencies
npm install

# Jalankan server dengan hot reload di localhost:8080
npm run dev

## Docker Run

docker build --no-cache --platform=linux/amd64 -t imajin-product-service:v1.0.0 .
docker run -d -p 9000:9000 --name imajin-product-service --env-file env-docker imajin-product-service:v1.0.0

## Running test
npm run test

# Swagger Documentation
{{base_url}}/api-docs
{{base_url}}/docs