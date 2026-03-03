import { ColorEntity } from '../../../domain/color/color.entity.js';

export class ColorMapper {
  static toDomain(doc: any): ColorEntity | null {
    if (!doc) return null;
    return new ColorEntity({
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

  static toDomainList(docs: any[]): ColorEntity[] {
    return docs
      .map((doc) => ColorMapper.toDomain(doc))
      .filter(Boolean) as ColorEntity[];
  }
}
