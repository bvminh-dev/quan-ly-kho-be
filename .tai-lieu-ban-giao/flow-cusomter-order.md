# Quy Trình Quản Lý Đơn Hàng Khách Hàng

## 1. Tổng Quan

Hệ thống quản lý đơn hàng gồm 3 phần chính:

| Phần | Mô tả |
|------|--------|
| **Khách hàng** | Thông tin khách mua hàng, theo dõi công nợ |
| **Kho hàng** | Quản lý số lượng tồn kho, giá bán của từng mặt hàng |
| **Đơn hàng** | Ghi nhận giao dịch mua bán giữa khách hàng và kho |

---

## 2. Vòng Đời Đơn Hàng (Trạng Thái)

Mỗi đơn hàng sẽ đi qua các trạng thái sau:

| Trạng thái | Ý nghĩa |
|------------|----------|
| **Báo giá** | Đơn hàng vừa được tạo, đang ở giai đoạn báo giá cho khách |
| **Chỉnh sửa** | Đơn hàng đang được chỉnh sửa lại sản phẩm hoặc số lượng |
| **Đã chốt** | Khách đồng ý, đơn hàng được xác nhận chính thức |
| **Hoàn tác** | Hủy đơn hàng, trả lại hàng vào kho |

### Sơ đồ chuyển trạng thái

```mermaid
stateDiagram-v2
    [*] --> BáoGiá : Tạo đơn hàng mới
    BáoGiá --> ĐãChốt : Chốt đơn
    BáoGiá --> ChỉnhSửa : Sửa sản phẩm
    ChỉnhSửa --> ĐãChốt : Chốt đơn
    ChỉnhSửa --> ChỉnhSửa : Sửa tiếp
    BáoGiá --> HoànTác : Hoàn tác (nếu khách chưa trả tiền)
    ChỉnhSửa --> HoànTác : Hoàn tác (nếu khách chưa trả tiền)
    ĐãChốt --> HoànTác : Hoàn tác (nếu khách chưa trả tiền)
    HoànTác --> [*] : Kết thúc
```

---

## 3. Quy Trình Chi Tiết Từng Bước

### Bước 1: Tạo đơn hàng mới

```mermaid
flowchart TD
    A[Nhân viên chọn khách hàng] --> B[Nhập tỷ giá]
    B --> C[Chọn sản phẩm từ kho]
    C --> D[Nhập số lượng, đơn giá, giảm giá cho từng sản phẩm]
    D --> E{Kho còn đủ hàng?}
    E -- Không --> F[Báo lỗi: không đủ hàng]
    E -- Có --> G[Hệ thống tự tính tổng tiền đơn hàng]
    G --> H[Tạo đơn với trạng thái: Báo giá]
    H --> I[Trừ số lượng hàng trong kho\nSố lượng chiếm dụng tăng\nSố lượng khả dụng giảm]
```

**Giải thích đơn giản:**
- Khi tạo đơn, hàng trong kho sẽ bị **"giữ chỗ"** (chiếm dụng) cho đơn hàng này.
- Tổng tiền đơn hàng được tính tự động dựa trên: `Số lượng × Đơn giá − Giảm giá`.
- Ban đầu khách chưa trả tiền nên hệ thống ghi nhận khách **nợ toàn bộ** giá trị đơn hàng.

---

### Bước 2: Chỉnh sửa đơn hàng (nếu cần)

```mermaid
flowchart TD
    A[Chọn đơn hàng cần sửa] --> B{Đơn đã hoàn tác chưa?}
    B -- Đã hoàn tác --> C[Không cho phép sửa]
    B -- Chưa --> D[Trả lại hàng cũ vào kho]
    D --> E[Nhập lại sản phẩm mới]
    E --> F{Kho còn đủ hàng mới?}
    F -- Không --> G[Báo lỗi: không đủ hàng]
    F -- Có --> H[Tính lại tổng tiền]
    H --> I[Giữ chỗ hàng mới trong kho]
    I --> J[Trạng thái chuyển sang: Chỉnh sửa]
```

**Giải thích đơn giản:**
- Khi sửa đơn, hệ thống sẽ **trả hàng cũ lại kho** trước, rồi mới **giữ hàng mới**.
- Tổng tiền và công nợ được tính lại dựa trên sản phẩm mới.

---

### Bước 3: Chốt đơn hàng

```mermaid
flowchart TD
    A[Chọn đơn hàng] --> B{Đơn đã chốt rồi?}
    B -- Rồi --> C[Báo lỗi: đã chốt rồi]
    B -- Chưa --> D{Đơn đã hoàn tác?}
    D -- Rồi --> E[Không thể chốt đơn đã hoàn tác]
    D -- Chưa --> F[Chuyển trạng thái sang: Đã chốt ✅]
```

**Giải thích đơn giản:**
- Chốt đơn nghĩa là **xác nhận chính thức** đơn hàng này.
- Chỉ chốt được khi đơn chưa chốt và chưa hoàn tác.

---

### Bước 4: Ghi nhận thanh toán (Lịch sử thanh toán)

Sau khi đơn hàng được tạo, khách có thể thanh toán nhiều lần. Mỗi lần thanh toán sẽ được ghi vào lịch sử.

```mermaid
flowchart TD
    A[Chọn đơn hàng] --> B[Chọn loại giao dịch]
    B --> C{Loại giao dịch?}
    C -- Khách trả tiền --> D[Nhập số tiền NGN, Dolar, tỷ giá]
    D --> E[Chọn phương thức: Chuyển khoản / Tiền mặt / Thẻ / Khác]
    E --> F[Nhập ngày thanh toán]
    F --> G[Công nợ khách GIẢM đi số tiền vừa trả]
    C -- Hoàn tiền cho khách --> H[Nhập số tiền hoàn]
    H --> I[Công nợ khách TĂNG lên số tiền hoàn]
```

**Giải thích đơn giản:**

| Loại giao dịch | Ý nghĩa | Ảnh hưởng công nợ |
|----------------|----------|-------------------|
| **Khách trả** | Khách thanh toán tiền hàng | Nợ **giảm** (khách nợ ít hơn) |
| **Hoàn tiền** | Cửa hàng trả lại tiền cho khách | Nợ **tăng** (khách nợ nhiều hơn) |

> **Về đơn vị tiền:** Hệ thống hỗ trợ 2 đơn vị tiền: **NGN** (Naira) và **Dolar (USD)**. Tỷ giá quy đổi được nhập khi tạo đơn hàng và khi ghi nhận thanh toán.

---

### Bước 5: Hoàn tác đơn hàng (Hủy đơn)

```mermaid
flowchart TD
    A[Chọn đơn hàng cần hoàn tác] --> B{Đơn đã hoàn tác rồi?}
    B -- Rồi --> C[Không thể hoàn tác lần nữa]
    B -- Chưa --> D{Khách đã trả tiền chưa?}
    D -- Đã trả một phần hoặc toàn bộ --> E[Không cho phép hoàn tác ❌\nPhải hoàn tiền trước]
    D -- Chưa trả đồng nào --> F[Trả toàn bộ hàng lại kho\nSố lượng khả dụng tăng\nSố lượng chiếm dụng giảm]
    F --> G[Trạng thái chuyển sang: Hoàn tác]
```

**Giải thích đơn giản:**
- Hoàn tác = **hủy đơn hàng** và **trả hàng lại kho**.
- Chỉ được hoàn tác khi khách **chưa trả bất kỳ đồng nào** (tức công nợ đúng bằng tổng giá trị đơn hàng).

---

## 4. Sơ Đồ Tổng Quan Toàn Bộ Quy Trình

```mermaid
flowchart TB
    subgraph KhachHang["👤 KHÁCH HÀNG"]
        KH[Thông tin khách hàng\nCông nợ tổng]
    end

    subgraph Kho["📦 KHO HÀNG"]
        WH[Danh sách sản phẩm\nSố lượng tồn / chiếm dụng / khả dụng\nGiá bán]
    end

    subgraph DonHang["📋 ĐƠN HÀNG"]
        direction TB
        TaoDon[1. Tạo đơn\nTrạng thái: Báo giá] --> SuaDon[2. Sửa đơn\nTrạng thái: Chỉnh sửa]
        TaoDon --> ChotDon[3. Chốt đơn\nTrạng thái: Đã chốt]
        SuaDon --> ChotDon
        TaoDon --> HoanTac[5. Hoàn tác\nTrạng thái: Hoàn tác]
        SuaDon --> HoanTac
        ChotDon --> HoanTac
        ChotDon --> ThanhToan[4. Ghi nhận thanh toán]
        TaoDon --> ThanhToan
        SuaDon --> ThanhToan
    end

    KH -- Chọn khách --> TaoDon
    WH -- Chọn sản phẩm --> TaoDon
    TaoDon -- Giữ chỗ hàng --> WH
    SuaDon -- Trả hàng cũ, giữ hàng mới --> WH
    HoanTac -- Trả hàng lại kho --> WH
    ThanhToan -- Cập nhật công nợ --> KH
```

---

## 5. Quản Lý Kho Hàng — Cách Số Lượng Thay Đổi

| Hành động | Số lượng chiếm dụng | Số lượng khả dụng |
|-----------|---------------------|-------------------|
| Tạo đơn hàng | **Tăng** (hàng bị giữ) | **Giảm** (hàng còn ít hơn) |
| Sửa đơn hàng | Trả cũ rồi giữ mới | Cập nhật lại theo sản phẩm mới |
| Hoàn tác đơn hàng | **Giảm** (hàng được trả lại) | **Tăng** (hàng có thêm) |

> **Tổng số lượng** = Số lượng chiếm dụng + Số lượng khả dụng (luôn không đổi)

---

## 6. Công Nợ Khách Hàng — Cách Tính

| Giá trị | Ý nghĩa |
|---------|----------|
| **Số âm (−)** | Khách đang **nợ** tiền |
| **Số dương (+)** | Khách đã trả **thừa** tiền |
| **Bằng 0** | Khách đã thanh toán đủ |

**Ví dụ minh họa:**

1. Tạo đơn hàng 1.000 NGN → Công nợ: **−1.000** (khách nợ 1.000)
2. Khách trả 600 NGN → Công nợ: **−400** (khách còn nợ 400)
3. Khách trả tiếp 500 NGN → Công nợ: **+100** (khách trả thừa 100)

---

## 7. Phân Quyền

| Chức năng | Ai được làm? |
|-----------|-------------|
| Tạo khách hàng | Tất cả nhân viên |
| Xóa khách hàng | Chỉ **Admin** |
| Tạo đơn hàng | Tất cả nhân viên |
| Sửa đơn hàng | Tất cả nhân viên |
| Chốt đơn hàng | Tất cả nhân viên |
| Hoàn tác đơn hàng | Tất cả nhân viên |
| Ghi nhận thanh toán | Tất cả nhân viên |
| Xóa đơn hàng | Chỉ **Admin** |
| Thêm sản phẩm vào kho | Tất cả nhân viên |

---

## 8. Phương Thức Thanh Toán Được Hỗ Trợ

| Phương thức | Mô tả |
|------------|-------|
| Chuyển khoản | Thanh toán qua tài khoản ngân hàng |
| Tiền mặt | Thanh toán trực tiếp bằng tiền mặt |
| Thẻ | Thanh toán bằng thẻ (Visa, MasterCard...) |
| Khác | Các hình thức thanh toán khác |

---

## 9. Cấu Trúc Sản Phẩm Trong Đơn Hàng

Mỗi đơn hàng có thể chứa nhiều **nhóm sản phẩm (Set)**. Mỗi nhóm gồm nhiều **mặt hàng** lấy từ kho.

```mermaid
flowchart TB
    DH["📋 Đơn hàng"] --> Set1["Set 1: Bộ tóc Natural 14 inch"]
    DH --> Set2["Set 2: Bộ tóc Bone Straight 20 inch"]
    Set1 --> Item1A["Closure 14 inch × 2"]
    Set1 --> Item1B["Weft 14 inch × 5"]
    Set2 --> Item2A["Frontal 20 inch × 1"]
    Set2 --> Item2B["Weft 20 inch × 3"]
```

**Hai cách tính giá:**

| Cách tính | Khi nào dùng? | Công thức |
|-----------|--------------|-----------|
| **Tính theo từng mặt hàng** | Khi không bật "Tính theo Set" | Số lượng × Đơn giá − Giảm giá (cho từng mặt hàng) |
| **Tính theo Set** | Khi bật "Tính theo Set" | Số lượng Set × Giá Set − Giảm giá Set |

---

## 10. Lưu Ý Quan Trọng

- Hệ thống **không xóa dữ liệu thật sự**, chỉ đánh dấu "đã xóa" để có thể khôi phục khi cần.
- Mọi thay đổi đều ghi nhận **ai làm** và **khi nào** (thời gian tạo, thời gian cập nhật).
- Tỷ giá có thể khác nhau giữa các đơn hàng và giữa các lần thanh toán.
