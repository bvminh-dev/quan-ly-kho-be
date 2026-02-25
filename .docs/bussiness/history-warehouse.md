# Nơi lưu lại thông tin xuất, nhập kho của từng hàng hóa

## 1. Gồm 2 schema sau

### 1.1 Schema cho nhập kho `history-enter` gồm các field:
- warehouseId: objectId, ref: warehouse
- item: Lưu dư thừa từ schema warehouse
- inches: Lưu dư thừa từ schema warehouse
- quality: Lưu dư thừa từ schema warehouse
- style: Lưu dư thừa từ schema warehouse
- color: Lưu dư thừa từ schema warehouse
- type: string, các giá trị bao gồm: Tạo mới, nhập thêm hàng, hoàn đơn, sửa giá, xóa
- metadata: object, để lưu thông tin liên quan đến lần thay đổi đó
  - Khi type = tạo mới, metadata gồm thông tin:
    - totalAmount: number // tổng số lượng
    - priceHigh: number // giá cao
    - priceLow: number // giá thấp
    - sale: number // giảm giá
  - Khi type = nhâp thêm hàng, metadata gồm thông tin:
    - quantity: number // số lượng nhập thêm
  - Khi type = hoàn đơn, metadata gồm thông tin:
    - quantityRevert: number // số lượng hoàn đơn
    - orderId: objectId, ref: order // Id đơn hàng bị hoàn
  - khi type = sửa giá, metadata gồm:
    - priceHighNew: number // giá cao mới
    - priceHighOld: number // giá cao cũ
    - priceLowNew: number // giá thấp mới
    - priceLowOld: number // giá thấp cũ
    - saleNew: number // sale mới
    - saleOld: number // sale cũ
- note?: string // ghi chú

### 1.2 Schema cho xuất kho `history-export` gồm các field:
- warehouseId: objectId, ref: warehouse
- item: Lưu dư thừa từ schema warehouse
- inches: Lưu dư thừa từ schema warehouse
- quality: Lưu dư thừa từ schema warehouse
- style: Lưu dư thừa từ schema warehouse
- color: Lưu dư thừa từ schema warehouse
- priceHigh: number // giá cao, Lưu dư thừa từ schema warehouse
- priceLow: number // giá thấp, Lưu dư thừa từ schema warehouse
- sale: number // giảm giá, Lưu dư thừa từ schema warehouse
- orderId: objectId, ref: order // Id đơn hàng
- type: string // loại đơn theo giá cao hoặc giá thấp với 1 trong các giá trị sau: cao, thấp, lưu dư thừa từ schema order
- priceOrder: number // giá bán của đơn hàng lúc đó
- saleOrder: number // giá sale của đơn hàng lúc đó
- quantityOrder: number // tổng số lượng bán của đơn hàng lúc đó
- stateOrder: string // là một trong các giá trị sau: Báo giá | Đã chốt | Chỉnh sửa | Khách trả | Hoàn đơn | Đã xong
- paymentOrder: number // Số tiền khách vừa trả (giá trị dương), số tiền vừa hoàn đơn (giá trị âm) theo đơn giá NGN
- note?: string // ghi chú

## 2. Nghiệp vụ
### 2.1 Nghiệp vụ nhập kho
- Với data được tạo lần đầu, note default: "Khởi tạo"
- Với nguyên liệu được thêm thì note được lấy từ note ở api thêm hàng hóa.
- Sửa giá thì note phải mô tả sự thay đổi giá
- Với nguyên liệu được thêm từ hoàn đơn, note được lấy từ api hoàn đơn.
- Với từng trường hợp thì metadata lấy tương ứng

### 2.2 Nghiệp vụ xuất kho
Vì thế khi lên đơn, nếu đơn hàng đang ở trạng thái báo giá sau đó chuyển sang trạng thái chỉnh sửa mà khách chưa từng trả tiền thì trạng thái vẫn ở Báo giá. Trạng thái chỉnh sửa chỉ xuất hiện sau trạng thái đã chốt: Báo giá -> Đã chốt -> Chỉnh sửa  -> Đã xong hoặc hoàn tác. Do đó tôi muốn ghi nhận ở trạng thái đã chốt và trạng thái chỉnh sửa,

### 2.3 Nghiệp vụ chung
- Tất cả đều phải lắng nghe event qua emit để insert vào DB
- Viết api CRUD
