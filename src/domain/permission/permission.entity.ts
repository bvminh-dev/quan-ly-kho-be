export class PermissionEntity {
  _id: string;
  name: string;
  apiPath: string;
  method: string;
  module: string;
  description: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDeleted: boolean;
  deleteBy: string | null;

  constructor(partial: Partial<PermissionEntity>) {
    Object.assign(this, partial);
  }
}
