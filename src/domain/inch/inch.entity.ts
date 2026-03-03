export class InchEntity {
  _id: string;
  code: string;
  name: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deleteBy: string | null;

  constructor(partial: Partial<InchEntity>) {
    Object.assign(this, partial);
  }
}
