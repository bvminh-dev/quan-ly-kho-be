import { RoleEntity } from '../../../domain/role/role.entity.js';

export class RoleMapper {
  static toDomain(doc: any): RoleEntity | null {
    if (!doc) return null;
    return new RoleEntity({
      _id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      permissions: doc.permissions
        ? doc.permissions.map((p: any) =>
            typeof p === 'object' && p._id ? p : p?.toString(),
          )
        : [],
      createdBy: doc.createdBy ? doc.createdBy.toString() : null,
      updatedBy: doc.updatedBy ? doc.updatedBy.toString() : null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      isActive: doc.isActive,
      isDeleted: doc.isDeleted,
      deleteBy: doc.deleteBy ? doc.deleteBy.toString() : null,
    });
  }

  static toDomainList(docs: any[]): RoleEntity[] {
    return docs
      .map((doc) => RoleMapper.toDomain(doc))
      .filter(Boolean) as RoleEntity[];
  }
}
