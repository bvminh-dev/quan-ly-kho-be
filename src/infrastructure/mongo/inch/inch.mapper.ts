import { InchEntity } from '../../../domain/inch/inch.entity.js';

export class InchMapper {
  static toDomain(doc: any): InchEntity | null {
    if (!doc) return null;
    return new InchEntity({
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

  static toDomainList(docs: any[]): InchEntity[] {
    return docs
      .map((doc) => InchMapper.toDomain(doc))
      .filter(Boolean) as InchEntity[];
  }
}
