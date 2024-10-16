import { Controller, Get, Post } from '@nuxum/core';
import { Request, Response } from 'express';

@Controller('/')
export class HelloController {
  @Get()
  public hello(req: Request, res: Response) {
    res.send('Hello World!');
  }

  @Post({
    path: '/post',
    query: [{ name: 'name', required: true, type: 'string' }],
    body: [{ name: 'age', required: true, type: 'number' }],
  })
  public post(req: Request, res: Response) {
    res.send('Hello, Post!');
  }
}