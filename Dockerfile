# ==========================================
# Etapa 1: Construcción (Build)
# ==========================================
FROM node:22-alpine AS build

WORKDIR /app

# Copiar archivos de definición de dependencias
COPY package*.json ./

# Instalar dependencias limpias según package-lock.json
RUN npm ci

# Copiar el código fuente
COPY . .

# Generar los archivos estáticos en ./dist
RUN npm run build

# ==========================================
# Etapa 2: Servidor Web de Producción (Runtime)
# ==========================================
FROM nginx:alpine AS runtime

# Configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos compilados
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
