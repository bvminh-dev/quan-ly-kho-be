export class RoleEntity {
  _id!: string;
  name!: string;
  description!: string;
  permissions!: any[];
  createdBy!: string | null;
  updatedBy!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  isActive!: boolean;
  isDeleted!: boolean;
  deleteBy!: string | null;
  isViewAllUser: boolean = false;
  viewAllUserApis: Array<{ _id: string; apiPath: string; method: string }> = [];

  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }
}
