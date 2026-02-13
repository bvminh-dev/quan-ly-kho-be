import { CustomerEntity } from '../../../domain/customer/customer.entity.js';

export class CustomerMapper {
  static toDomain(doc: any): CustomerEntity | null {
    if (!doc) return null;
    return new CustomerEntity({
      _id: doc._id.toString(),
      name: doc.name,
      payment: doc.payment,
      note: doc.note,
      createdBy: doc.createdBy ? doc.createdBy.toString() : null,
      updatedBy: doc.updatedBy ? doc.updatedBy.toString() : null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      isDeleted: doc.isDeleted,
      deleteBy: doc.deleteBy ? doc.deleteBy.toString() : null,
    });
  }

  static toDomainList(docs: any[]): CustomerEntity[] {
    return docs.map((doc) => CustomerMapper.toDomain(doc)).filter(Boolean) as CustomerEntity[];
  }
}
