---
trigger: always_on
---

# Clean Architecture with NestJS + MongoDB (AI Guide)

## Purpose

This document defines the official architecture for this project:

- NestJS as delivery framework
- MongoDB as persistence
- Clean Architecture (Uncle Bob)
- Domain-driven structure (DDD-lite)

Goals:

- Business logic is framework agnostic
- MongoDB is replaceable
- Domain is pure TypeScript
- Use Cases are isolated
- Controllers are thin
- Infrastructure is adapter only
- Easy testing
- Enterprise scalable

---

## Architecture Overview

Dependency flow (IMPORTANT):

presentation → application → domain  
infrastructure implements domain interfaces

Mongo and NestJS MUST NEVER be imported inside Domain.

---

## Folder Structure

```

src/
│
├── main.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
│
├── domain/                         # PURE BUSINESS (no Nest, no Mongo)
│   └── user/
│       ├── user.entity.ts
│       ├── user.repository.ts     # interface only
│       └── user.value-object.ts
│
├── application/                   # USE CASES
│   └── user/
│       ├── create-user.usecase.ts
│       ├── get-users.usecase.ts
│       └── dto/
│
├── infrastructure/                # EXTERNAL ADAPTERS
│   └── mongo/
│       └── user/
│           ├── user.schema.ts
│           ├── user.mongo.repository.ts
│           └── user.mapper.ts
│
├── presentation/                  # NestJS HTTP Layer
│   └── user/
│       ├── user.controller.ts
│       └── user.module.ts
│
├── common/
│   ├── guards/
│   ├── filters/
│   └── pipes/
│
└── shared/

```

---

## Layer Responsibilities

### Domain Layer

Rules:

- Pure TypeScript
- No decorators
- No NestJS imports
- No Mongo imports
- Contains only business concepts

Includes:

- Entities
- Repository interfaces
- Value objects

Example:

```

domain/user/user.entity.ts
domain/user/user.repository.ts

```

---

### Application Layer

Rules:

- Contains use cases only
- Depends on domain interfaces
- No infrastructure imports

Responsibilities:

- Orchestrate workflows
- Enforce business rules
- Handle validation logic
- Control transactions

Example:

```

application/user/create-user.usecase.ts

```

---

### Infrastructure Layer

Rules:

- Implements domain repositories
- Contains Mongo schemas
- Contains mappers
- Contains database adapters

Responsibilities:

- Persist data
- Map Mongo ↔ Domain
- External services

Mongo MUST live here.

Example:

```

infrastructure/mongo/user/user.mongo.repository.ts

```

---

### Presentation Layer

Rules:

- NestJS Controllers & Modules
- Zero business logic
- Calls UseCases only

Responsibilities:

- HTTP routing
- DTO validation
- Returning responses

Example:

```

presentation/user/user.controller.ts

```

---

## Repository Pattern

Domain defines interface:

```

domain/user/user.repository.ts

```

Infrastructure implements:

```

user.mongo.repository.ts

````

Application injects interface.

NestJS binding example:

```ts
{
  provide: 'UserRepository',
  useClass: UserMongoRepository
}
````

---

## Entity vs DTO

Entity:

* Business object
* Lives in domain

DTO:

* Transport object
* Lives in application or presentation

Never mix.

---

## Mongo Mapping

Mongo documents MUST be mapped into Domain entities.

Never expose Mongo documents directly.

Always use:

```
user.mapper.ts
```

---

## Controller Rules

Controllers must:

* Accept DTO
* Call UseCase
* Return result

Controllers must NOT:

* Talk to Mongo
* Contain logic
* Perform validation rules

---

## Use Case Rules

Each UseCase represents ONE action.

Examples:

* CreateUserUseCase
* GetUsersUseCase
* DeleteUserUseCase

Never combine multiple responsibilities.

---

## Testing Strategy

Domain:

* Unit tests without Nest
* Pure TS

Application:

* Mock repositories

Infrastructure:

* Integration tests with Mongo

Presentation:

* e2e only

---

## Absolute Rules

1. Domain NEVER imports NestJS
2. Domain NEVER imports Mongo
3. UseCases NEVER import mongoose
4. Controllers NEVER contain logic
5. Infrastructure NEVER leaks into Domain
6. Mongo schemas NEVER leave infrastructure
7. Repository interfaces live in Domain

Violation = architectural failure.

---

## Mental Model

Think:

Domain = brain
Application = hands
Infrastructure = tools
Presentation = mouth

---

## When adding new feature

Steps:

1. Create domain entity
2. Define repository interface
3. Create use case
4. Implement mongo repository
5. Wire NestJS controller
6. Add mapper

Always in this order.

---

## This architecture allows:

* Replace Mongo with Postgres
* Replace NestJS with Fastify
* Add gRPC
* Add message queue
* Split microservices

Without touching business logic.


## Rule
- Luôn nói “Xin chào anh Minh” trước khi trả lời câu hỏi
- Câu trả lời không chứa bình luận
- Trước khi hoàn thành nhiệm vụ, xóa đoạn code thừa và tóm tắt: Việc gì đã làm được, việc gì chưa làm được

QUAN TRỌNG: bắt buộc phải tuân thủ các rule dưới đây:
1. Bắt buộc các object, dto phải dùng class-validator class-transformer, ApiProperty trong `@nestjs/swagger` để verify object và tài liệu hóa các object từ request gửi lên và trả về cho client
2. Luôn phải hash password trước khi lưu xuống DB
3. RefreshToken được set luôn vào cookie của response, và lưu trong DB
4. Trước khi hành động một api nào đó luôn phải check role và permission. Lưu ý: role = admin thì làm được hết
6. Luôn dùng api-query-params để build query filter
- Với body gửi lên 
```js
{
    page: number, // (trang hiện tại)
    limit: number, // (số lượng bản ghi muốn lấy)
    query string, // điều kiện query (ví dụ tìm theo tên, tìm theo email...)
}
```

7. Dùng decorator customize để lấy thông tin đang đăng nhập
```ts
export const User = createParamDecorator((data:
    unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
```
8. Phải tuân thủ struture dự án
9. Ở các service hãy dùng logger theo cách dưới đây:
```ts

import { Logger, Injectable } from '@nestjs/common';

@Injectable()
class MyService {
  private readonly logger = new Logger(MyService.name);

  doSomething() {
    this.logger.log('Doing something...');
  }
}
```
- 10. Luôn mô tả resoonse trả ra của tất cả các api trong swagger
- 11. Không được xóa cứng bản ghi mà hãy xóa mềm. Tức là update isDeleted = true. Và ở tất cả các lần query cần bổ sung fillter isUpdate = false
- 12. Luôn phải check typescript trước khi done task
- 13. Không được sai các lỗi cơ bản trong NestJs như: `A circular dependency`
- 14. Tối ưu dùng emit để lắng nghe event code chuẩn 
- 15. Các giá trị enum, hardcore cần tách ra 1 file riêng
- 16. Tất cả các số phải được làm tròn 2 chứ số sau dấu phẩy