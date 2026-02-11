import { UserEntity } from './user.entity.js';

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByRefreshToken(refreshToken: string): Promise<UserEntity | null>;
  create(user: Partial<UserEntity>): Promise<UserEntity>;
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity | null>;
  softDelete(id: string, deleteBy: string): Promise<void>;
  findAll(
    queryString: string,
    currentPage: number,
    pageSize: number,
  ): Promise<{
    items: UserEntity[];
    meta: { current: number; pageSize: number; pages: number; total: number };
  }>;
  updateRefreshToken(id: string, refreshToken: string | null): Promise<void>;
  count(): Promise<number>;
}
