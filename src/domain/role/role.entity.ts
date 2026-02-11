export class RoleEntity {
  _id: string;
  name: string;
  description: string;
  permissions: any[];
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDeleted: boolean;
  deleteBy: string | null;

  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }
}
