export class UserEntity {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string | { _id: string; name: string } | null;
  refreshToken: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDeleted: boolean;
  deleteBy: string | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
