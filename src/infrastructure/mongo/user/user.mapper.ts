import { UserEntity } from '../../../domain/user/user.entity.js';

export class UserMapper {
  static toDomain(doc: any): UserEntity | null {
    if (!doc) return null;
    return new UserEntity({
      _id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      role:
        doc.role && typeof doc.role === 'object' && doc.role.name
          ? { _id: doc.role._id.toString(), name: doc.role.name }
          : doc.role
            ? doc.role.toString()
            : null,
      refreshToken: doc.refreshToken || null,
      createdBy: doc.createdBy ? doc.createdBy.toString() : null,
      updatedBy: doc.updatedBy ? doc.updatedBy.toString() : null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      isActive: doc.isActive,
      isDeleted: doc.isDeleted,
      deleteBy: doc.deleteBy ? doc.deleteBy.toString() : null,
    });
  }

  static toDomainList(docs: any[]): UserEntity[] {
    return docs.map((doc) => UserMapper.toDomain(doc)).filter(Boolean) as UserEntity[];
  }
}
