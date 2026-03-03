export class ItemEntity {
  _id: string;
  code: string;
  name: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deleteBy: string | null;

  constructor(partial: Partial<ItemEntity>) {
    Object.assign(this, partial);
  }
}
