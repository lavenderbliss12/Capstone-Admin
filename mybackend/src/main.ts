// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true }); // enable CORS
  const port = parseInt(process.env.PORT ?? '5000', 10);
  await app.listen(port);
  // Friendly startup log so it's obvious which port is used
  // When running in PowerShell: `npm run start:dev` you'll see this line
  // If you want port 3000 for compatibility with other tooling, set PORT=3000
  // Example: $env:PORT = '3000'; npm run start:dev
  // or on Linux/macOS: PORT=3000 npm run start:dev
  // This makes it easy to avoid "Connection refused" due to wrong port.
  // NOTE: Do not commit sensitive env values into source control.
  // Log after listen to ensure the server started successfully.
  // eslint-disable-next-line no-console
  console.log(`Nest application listening on http://localhost:${port}`);
}

bootstrap();
