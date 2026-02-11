# Khởi tạo data mặc định hệ thống với lifecycle
- Mỗi lần (everytime) ứng dụng Nest.js khởi tạo, sẽ gọi function để check:
+ Để biết có dữ liệu hay chưa => dùng hàm find, hoặc hàm count
+ Nếu có dữ liệu init rồi => không làm gì cả
+ Nếu chưa có dữ liệu => tạo init data

Viết hàm onModuleInit bên trong service

- Mặc định 2 role: admin và user
- mặc định 2 users: admin và user

Thứ tự tạo:
- Tạo permissions
- Tạo role (với permissions) được tạo ở trên
- Tạo user với role được tạo ở trên