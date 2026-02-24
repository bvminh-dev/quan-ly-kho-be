# Tài liệu bussiness cho khách hàng, đơn hàng, kho

## Khách hàng

### Schema `customer` gồm:
- name: string, unique // tên khách
- payment: number // tổng tiền của khách có thể nợ hoặc chuyển thừa tiền. Với giá trị âm nghĩa là khách nợ, giá trị dương nghĩa là khách đang trả tiền thừa
- note: string
- createdBy: objectId, ref: user
- updatedBy: objectId, ref: user
- createdAt: datetime
- updatedAt: datetime
- isDeleted: bool
- deleteBy: ObjectId, ref: user

### Nghiệp vụ:
- Khi tạo customer cần kiểm tra customer có trùng tên trong hệ thống với isDeleted = false không. Bất kỳ user nào trong hệ thống đều có quyền tạo customer
- Chỉ user role = admin mới có quyền xóa `customer`

## Kho hàng
### Schema `warehouse` gồm
- inches: number // là 1 strong các giá trị: 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30
- item: string // là 1 trong các giá trị: CLOSURE, FRONTAL, WEFT
- quality: string // là 1 trong các giá trị: SDD, DD, VIP, SINGLEDONOR, 2X4, 2X4 SINGLEDONOR, 2X6, 2X6 SINGLEDONOR, 5X5, 5X5 HD, 5X5 SINGLEDONOR, 5X5 SINGLEDONOR HD, 13X4, 13X4 HD, 13X6, 13X6 HD 
- style: string // là 1 trong các giá trị: BONESTRAIGHT, BONESTRAIGHT LỖI, BOUNCE, EGG LỖI, EGGCURLS
- color: string // là 1 trong các giá trị: NATURAL, BROWN COPPER, BURGUNDY, GREY, PIANO RED, BURGUNDYN, BROWN TIP, BROWN CŨ, BROWN LẪN
- totalAmount: number // tổng số lượng
- amountOccupied: number // tổng số lượng chiếm dụng
- amountAviable: number // tổng số lượng khả dụng
- unitOfCalculation: string // đơn vị tính, là 1 trong các giá trị: Kg hoặc Pcs
- priceHigh: number // giá cao
- priceLow: number // giá thấp
- sale: number // giảm giá
- createdBy: objectId, ref: user
- updatedBy: objectId, ref: user
- createdAt: datetime
- updatedAt: datetime
- isDeleted: bool
- deleteBy: ObjectId, ref: user

### Nghiệp vụ
- Ai cũng có quyền thêm warehouse


## Đơn hàng

### Schema `order` gồm:
- type: string // loại đơn theo giá cao hoặc giá thấp với 1 trong các giá trị sau: cao, thấp
- state: string // trạng thái đơn hàng gồm các giá trị sau: 
  + Báo giá: đơn hàng vừa được tạo, chưa xác nhận với khách, có thể chỉnh sửa tự do
  + Đã chốt: khách đã xác nhận đơn, chỉ cho phép chỉnh sửa thông qua nghiệp vụ chuyển sang trạng thái chỉnh sửa
  + Chỉnh sửa: trạng thái tạm khi đang cập nhật lại sản phẩm/giá; sau khi lưu xong thì có thể chuyển lại sang đã chốt hoặc báo giá tùy nghiệp vụ
  + Hoàn tác: đơn hàng bị hủy/hoàn tác toàn bộ, kho được cộng trả lại (xem chi tiết phần nghiệp vụ)
  + Đã xong: đơn hàng đã thanh toán đủ, đã xuất kho xong
- exchangeRate: number // tỷ giá
- customer: objectId ref: customer
- totalPrice: number // tổng giá trị đơn hàng theo đơn vị NGN
- payment: number // số tiền khách trả thừa, trả thiếu, với giá trị âm là khách nợ, giá trị dương là khách trả thừa theo đơn vị NGN
- note: string // ghi chú
- products: {
  + nameSet?: string // tên set
  + priceSet?: number // giá set
  + quantitySet?: number // số lượng set
  + saleSet?: number // số tiền giả giá set
  + isCalcSet: bool // có tính theo giá set không, default = false
  + Items: {
    * id: objectId, ref: warehouse  
    * quantity: number // số lượng
    * price: number // đơn giá
    * sale: number // giảm giá
    * customPrice: bool // giá có khác với giá của bản ghi được set trong kho không, default = false
    * customSale: number // giảm giá có khác với giảm giá của bản ghi được set trong kho không, default - false
  }[]
}[]
- history: {
  + type: string // là 1 trong các giá trị: hoàn tiền, khách trả
  + exchangeRate: number // tỷ giá
  + moneyPaidNGN: number // tiền theo đơn vị NGN
  + moneyPaidDolar: number // tiền theo đơn vị Dolar
  + paymentMethod: string, // giá trị là 1 trong các giá trị sau: Chuyển khoản | Tiền mặt | Thẻ | Khác
  + datePaid: date // Ngày trả 
  + note?: string // ghi chú
}[]
- createdBy: objectId, ref: user
- updatedBy: objectId, ref: user
- createdAt: datetime
- updatedAt: datetime
- isDeleted: bool
- deleteBy: ObjectId, ref: user 

### Nghiệp vụ
- User trong hệ thống đều có quyền tạo đơn hàng, thông tin bắt buộc gồm: Tỷ giá, khách hàng. products phải có ít nhất 1 element. Item phải điền số lượng, đơn giá, giảm giá. Khi tạo đơn hàng, state mặc định là: Báo giá. Khi tạo thành công thì tính toán số lượng của từng item rồi update lại vào bản ghi đó trong warehouse với các giá trị: Số lượng khả dụng, số lượng chiếm dụng
- Khi state chuyển sang chỉnh sửa thì tính toán lại số lượng hàng hóa đã chiếm dụng rồi update lại đúng bản ghi đó trong warehouse
- User ai cũng có quyền thêm lịch sử đơn hàng. Khi thêm lịch sử đơn hàng cần điền: moneyPaidNGN, exchangeRate, moneyPaidDolar, datePaid. Với type = hoàn tiền thì lấy số tiền payment + thêm tiền hoàn để khách nợ thêm số tiền hoàn đó.
- User ai cũng có quyền hoàn tác đơn hàng. trước khi hoàn tác cần phải kiểm tra: payment là số âm và (-1) * payment = totalPrice thì mới cho phép hoàn tác, và bắt buộc phải điền. Khi hoàn tác thì lấy số lượng hàng cộng lại vào kho
- Khi tiền khách hàng trả hết (không còn nợ) thì trạng thái đơn hàng cập nhật thành đã xong. Khi đó:
  + Chiếm dụng trong kho (`amountOccupied`) trừ đi đúng tổng số lượng của đơn hàng đó
  + Tổng số lượng trong kho (`totalAmount`) cũng trừ đi đúng tổng số lượng của đơn hàng đó
  + Việc trừ kho này chỉ thực hiện 1 lần duy nhất tại thời điểm chuyển trạng thái từ Báo giá/Đã chốt/Chỉnh sửa sang Đã xong, không trừ lại nếu sau đó cập nhật thông tin khác không liên quan tới số lượng
  + Điều kiện “tiền khách hàng trả hết” được hiểu là: `payment >= 0` (không còn nợ, có thể dư tiền). Trường hợp thanh toán dư thì số tiền dư giữ trong `payment` dương, nhưng vẫn được coi là đã xong và đã xuất kho
  + Không cho phép chuyển trạng thái sang Đã xong nếu `payment` đang âm (khách còn nợ)


## Lưu ý
- Tất cả các giá trị đều được tách ra 1 file enum