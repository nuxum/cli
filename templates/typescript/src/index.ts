import { NuxumApp } from '@nuxum/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = new NuxumApp({
    modules: [AppModule],
    logger: true,
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();