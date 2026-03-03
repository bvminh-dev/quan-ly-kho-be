import { ItemEntity } from '../../../domain/item/item.entity.js';

export class ItemMapper {
  static toDomain(doc: any): ItemEntity | null {
    if (!doc) return null;
    return new ItemEntity({
      _id: doc._id.toString(),
      code: doc.code,
      name: doc.name,
      createdBy: doc.createdBy ? doc.createdBy.toString() : null,
      updatedBy: doc.updatedBy ? doc.updatedBy.toString() : null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      isDeleted: doc.isDeleted,
      deleteBy: doc.deleteBy ? doc.deleteBy.toString() : null,
    });
  }

  static toDomainList(docs: any[]): ItemEntity[] {
    return docs
      .map((doc) => ItemMapper.toDomain(doc))
      .filter(Boolean) as ItemEntity[];
  }
}
