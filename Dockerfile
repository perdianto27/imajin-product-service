# Gunakan Node.js versi 22.12.0
FROM node:22.12.0

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json dulu (untuk caching layer)
COPY package*.json ./

# Install dependencies production saja
RUN npm ci --production

# Copy semua source code ke container
COPY . .

# Set environment variable (opsional)
ENV NODE_ENV=production
ENV PORT=9000

# Expose port yang digunakan aplikasi
EXPOSE 9000

# Command untuk menjalankan aplikasi
CMD ["npm", "start"]