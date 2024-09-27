import express from 'express';
import { Router } from '@nuxum/core';
import { HelloController } from './controllers/hello.controller';

const app = express();
new Router(app, {
  controllers: [HelloController]
});
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on http://localhost:3000');
});