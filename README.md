# Parcial práctico: Supermercados - Diseño y Construcción de APIs
### Maestría en Ingeniería de Software MISO - Universidad de los Andes
#### Lizeth Daniela Castellanos Alfonso


Nota: Todos los comandos listados se deben ejecutar en la raíz del proyecto

## Instalación y ejecución
1. Ejecutar `docker-compose up` para iniciar una base de datos postgresql de forma local (también puede hacerse uso de una base de datos completamente instalada en la máquina host)
2. Ejecutar `npm install` y `npm run start:dev`

## Ejecutar pruebas
1. Ejecutar `npm run test`

## Pruebas de postman
1. Importar las colecciones que están en la carpeta `collections` en el cliente de postman
2. Configurar las siguientes variables de entorno de postman:
   1. baseURL: `localhost:3000/api/v1`
   2. random_uuid: `12345678-1234-1234-1234-1234567890ab`
3. Ejecutar las peticiones de cada colección de forma secuencial
