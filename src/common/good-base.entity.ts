import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class GoodBaseEntity<T> {
  constructor(dto?: Partial<T>) {
    Object.assign(this, dto);
  }
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deleteAt: Date;
}
