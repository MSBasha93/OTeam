import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
  await app.listen(4000);
  console.log(`🚀 OTeam backend is running on http://localhost:4000`);
 app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
}

bootstrap();
