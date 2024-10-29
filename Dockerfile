# Imagen base
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el resto del código de la aplicación al contenedor
COPY . .

# Instala las dependencias de producción
RUN npm install 

# Comando para ejecutar la aplicación
CMD npm run dev