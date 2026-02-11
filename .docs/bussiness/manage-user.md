# Quản lý người dùng trong hệ thống

Schema `user` gồm:
- name: string required
- email: string required
- password: string
- role: objectId, ref: role
- refreshToken: string
- createdBy: objectId, ref: user
- updatedBy: objectId, ref: user
- createdAt: datetime
- updatedAt: datetime
- isActive: bool
- isDeleted: bool
- deleteBy: ObjectId, ref: user

## Tạo account
- Chỉ có role = admin mới có quyền tạo user
- Khi tạo user thì password phải được Hash User’s Password với bcryptjs secret key lấy từ .env với key: `ACCESS_TOKEN_SECRET_KEY` thông qua `configService` của `@nestjs/config`

## Signin 
- Follow theo `Passport (authentication)` cho nestjs với secret key lấy trong .env với key: `ACCESS_TOKEN_SECRET_KEY`
- Signin thành công trả về thông tin cơ bản của user: Tên, role, permission, accessToken (accesstoken chứa thông tin: id, name). Tuy nhiên, refreshToken được set luôn vào cookie của https với thời gian expire lấy theo config `ACCESS_TOKEN_EXPIRE_TIME` trong .env.
- Còn refresh token được lưu lại trong DB với 2 key tương ứng của refresh token là: `REFRESH_TOKEN_SECRET_KEY`, `REFRESH_TOKEN_EXPIRE_TIME`
- Sử dụng `@Public()` để public api này
- 

## API get list user, delete, active
- Chỉ có role admin mới có quyền get list user, delete user, active user

## API update password current user
- Khi current user update password cần yêu cầu nhập current password. Password mới phải được hash trước khi lưu vào DB

## API reset password cho bất kỳ user nào với role admin có quyền call api
- API reset password chỉ allow cho role admin. Body gửi lên gồm currentPassword và newPassword. 

## API refresh token
- Server lấy ra refresh_token từ cookies
- Server check (verify) để biết refresh_token có hợp lệ hay không ?
- Server query database theo refresh_token
    => lấy thông tin user
    => issue access_token mới
- Server trả ra phản hồi (set cookies ứng với refresh_token mới)
- Sử dụng `@Public()` để public api này

## API logout
Truyền lên JWT ở header
Response :
```js
{
    "statusCode": 201,,
    "message": "Logout User",
    "data": “ok”
}
```
Xử lý ở backend:
- Update refresh_token === null (empty)
- Remove refresh_token ở cookies (remove cookies)
- Trả về phản hồi cho client

# Phân quyền người dùng
Mô hình phân quyền:
1 user => có 1 role . 1 role => có n permissions
=> 1 user có n permissions khi sử dụng hệ thống
Sau này muốn thay đổi permission của user, chỉ cần thay đổi role là xong (update
role hiện tại, hoặc tạo role mới => gán user vào)

Lưu ý: 
- role = admin thì allow tất cả api
- không delete role admin

## Schema `role` gồm có:

- name: string <unique>
- description:string
- permissions: array objectid
- createdBy: objectId, ref: user
- updatedBy: objectId, ref: user
- createdAt: datetime
- updatedAt: datetime
- isActive: bool
- isDeleted: bool
- deleteBy: ObjectId, ref: user


## Schema `permission` gồm có:
- name : string
- apiPath : string
- method: string
- module:string //thuộc modules nào ?
- description:string
- createdBy: objectId, ref: user
- updatedBy: objectId, ref: user
- createdAt: datetime
- updatedAt: datetime
- isActive: bool
- isDeleted: bool
- deleteBy: ObjectId, ref: user


## Các bước chạy
Khi User gửi 1 request sử dụng jwt ở header, tới ‘protected endpoint’ (tức là những api không sử dụng @public):
- Bước 1: JWT auth guard sẽ được chạy (config trong file main.ts) app.useGlobalGuards(new JwtAuthGuard(reflector));
- Bước 2: Passport JWT strategy chạy (file jwt.strategy.ts) 
  - Nếu token hết hạn/không hợp lệ => thông báo lỗi.
  - Trường hợp token hợp lệ, decode (giải mã) token => cần gán thêm permissions vào req.user
  - Khi JWT auth guard được chạy, cần check permission tại đấy. Cần so sánh req.route và permission