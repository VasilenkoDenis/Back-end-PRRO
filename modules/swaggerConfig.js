const swaggerJsdoc = require('swagger-jsdoc'); // swagger-jsdoc - це бібліотека для Node.js, яка дозволяє генерувати документацію API у форматі OpenAPI (Swagger) на основі JSDoc-коментарів у вашому коді. Вона аналізує ваші коментарі та створює JSON-файл, який можна використовувати для створення інтерактивної документації API.
const swaggerUi = require('swagger-ui-express'); // swagger-ui-express - це middleware для Express, який дозволяє інтегрувати Swagger UI у ваш додаток. Swagger UI - це інтерфейс користувача для документації API, який дозволяє розробникам переглядати та тестувати ваші API-ендпоінти безпосередньо з браузера.

const options = {
  definition: {
    openapi: '3.0.0', // Вказуємо версію OpenAPI (Swagger)
    info: {
      title: 'My API', // Назва вашого API
      version: '1.0.0', // Версія вашого API    
      description: 'This is a sample API', // Опис вашого API 
    },
  },
  apis: ['./routes/*.js'], // Шлях до файлів, де знаходяться ваші JSDoc-коментарі для генерації документації
};  