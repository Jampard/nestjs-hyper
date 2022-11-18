import { Injectable } from '@nestjs/common';
import { InjectPool } from '../../../lib';
import { Photo } from './photo.entity';
import { DatabasePool } from 'hyper';

@Injectable()
export class PhotoService {
  constructor(
    @InjectPool()
    private readonly pool: DatabasePool,
    // @InjectPool('connection_2')
    // private readonly pool2: DatabasePool,
  ) { }

  async findAll() {
    return await this.pool.collection('photos').find() as Photo[];
  }

  async create() {
    return await this.pool.collection('photos').insert({ name: 'Nest', description: 'Is great!', views: 6000 }) as Photo
  }
}
