export class QualityEntity {
  _id: string;
  code: string;
  name: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deleteBy: string | null;

  constructor(partial: Partial<QualityEntity>) {
    Object.assign(this, partial);
  }
}
