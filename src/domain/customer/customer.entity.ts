export class CustomerEntity {
  _id: string;
  name: string;
  payment: number;
  note: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deleteBy: string | null;

  constructor(partial: Partial<CustomerEntity>) {
    Object.assign(this, partial);
  }
}
