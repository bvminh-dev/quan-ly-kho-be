import { StyleEntity } from '../../../domain/style/style.entity.js';

export class StyleMapper {
  static toDomain(doc: any): StyleEntity | null {
    if (!doc) return null;
    return new StyleEntity({
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

  static toDomainList(docs: any[]): StyleEntity[] {
    return docs
      .map((doc) => StyleMapper.toDomain(doc))
      .filter(Boolean) as StyleEntity[];
  }
}
