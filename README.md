# 🧩 Admin Productos Backend API

API REST profesional para la administración de productos, desplegada en railway, desarrollada con **Node.js, Express, Swagger, Jest, Supertest, TypeScript y Sequelize**.  
Este proyecto demuestra buenas prácticas de desarrollo backend, testing automatizado, CI/CD, validaciones, manejo de errores y diseño de APIs RESTful.

---

## 🎯 Propósito del Proyecto

Este repositorio fue creado para demostrar competencias técnicas en:

- Desarrollo backend profesional
- Diseño y construcción de APIs REST escalables
- Testing automatizado con Jest y Supertest
- Arquitectura limpia y modular
- Manejo de bases de datos SQL con Sequelize
- Uso de TypeScript en entornos productivos
- Validaciones robustas y manejo centralizado de errores
- Documentacion y manipulacion de api con Swagger

---

## 🛠️ Tecnologías Utilizadas

- Node.js  
- Express.js  
- TypeScript  
- Sequelize ORM  
- MySQL  
- Jest  
- Supertest  
- dotenv  
- express-validator
- Swagger

---

### Principios aplicados
- **Controllers**: lógica de negocio
- **Routes**: definición de endpoints
- **Models**: acceso y persistencia de datos
- **Middleware**: validaciones y manejo de errores
- **Config**: configuración de base de datos y entorno

---

## 📦 Instalación

```bash
git clone https://github.com/JuanPabloQB1990/admin-productos-backend.git
```

```bash
cd admin-productos-backend
```

```bash
npm install

```

## Crear bases de datos

Crea dos bases de datos una para ambiente de desarrollo y otra para los test para luego agregar la url de cada una en las variables de entorno:

```bash
adminproducts
```

```bash
adminproductstest
```

## ⚙️ Variables de Entorno

Crear un archivo .env en la raíz del proyecto:
```bash
DATABASE_URL=mysql://tu_usuario_mysql:tu_password_mysql@localhost:3306/productsadmin
DATABASE_URL_TEST=mysql://tu_usuario_mysql:tu_password_mysql@localhost:3306/productsadmintest
PORT=5000
FRONTEND_URL=http://localhost:5173
```

## ▶️ Ejecución del Proyecto

Modo desarrollo

```bash
npm run dev
```

## 🧪 Testing Automatizado

El proyecto incluye pruebas de integración completas que validan la lógica del negocio y el correcto funcionamiento de la API.

Ejecutar tests
```bash
npm run test
```

## Cobertura de pruebas

Las pruebas cubren:

Creación de productos

Validaciones de datos

Listado de productos

Búsqueda por ID

Actualización total (PUT)

Actualización parcial (PATCH)

Eliminación de productos

Manejo de errores y casos límite

Testing de controladores


## Manipula la api sin cliente frontend con la ayuda de Swagger desde este link, cuando ejecutes la api:

Swagger modo desarrollo
```bash
http://localhost:5000/docs
```

Swagger modo Producción
```bash
https://admin-productos-backend-production.up.railway.app/docs
```

[![swagger-admin-products.png](https://i.postimg.cc/zGDYKr41/swagger-admin-products.png)](https://postimg.cc/ppSSMg20)

## Si deseas ejecutar el frontend de este proyecto en modo producción o desarrollo, dirigete al repositorio y sigue los pasos del Readmi.md en este link:

```bash
https://github.com/JuanPabloQB1990/admin-products-frontend
```
  
