import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AsyncOptionsExistingModule } from '../src/async-existing-options.module';
import { Server } from 'http';

describe('Hyper (async configuration)', () => {
  let server: Server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AsyncOptionsExistingModule],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it(`should return created entity`, () => {
    return request(server)
      .post('/photo')
      .expect(201)
      .then((response) =>
        expect(response.body).toMatchObject({
          name: 'Nest',
          description: 'Is great!',
          views: 6000,
        }),
      );
  });

  afterEach(async () => {
    await app.close();
  });
});
