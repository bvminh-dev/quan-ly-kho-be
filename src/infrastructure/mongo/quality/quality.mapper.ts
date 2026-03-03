import { QualityEntity } from '../../../domain/quality/quality.entity.js';

export class QualityMapper {
  static toDomain(doc: any): QualityEntity | null {
    if (!doc) return null;
    return new QualityEntity({
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

  static toDomainList(docs: any[]): QualityEntity[] {
    return docs
      .map((doc) => QualityMapper.toDomain(doc))
      .filter(Boolean) as QualityEntity[];
  }
}
