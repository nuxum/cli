import { Controller, Get } from '@nuxum/core';
import { Request, Response } from 'express';

@Controller('/hello')
export class HelloController {
  @Get()
  public async hello(req: Request, res: Response) {
    res.json({ message: 'Hello, World!' });
  }
}