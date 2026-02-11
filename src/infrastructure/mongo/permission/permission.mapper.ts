import { PermissionEntity } from '../../../domain/permission/permission.entity.js';

export class PermissionMapper {
  static toDomain(doc: any): PermissionEntity | null {
    if (!doc) return null;
    return new PermissionEntity({
      _id: doc._id.toString(),
      name: doc.name,
      apiPath: doc.apiPath,
      method: doc.method,
      module: doc.module,
      description: doc.description,
      createdBy: doc.createdBy ? doc.createdBy.toString() : null,
      updatedBy: doc.updatedBy ? doc.updatedBy.toString() : null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      isActive: doc.isActive,
      isDeleted: doc.isDeleted,
      deleteBy: doc.deleteBy ? doc.deleteBy.toString() : null,
    });
  }

  static toDomainList(docs: any[]): PermissionEntity[] {
    return docs.map((doc) => PermissionMapper.toDomain(doc)).filter(Boolean) as PermissionEntity[];
  }
}
