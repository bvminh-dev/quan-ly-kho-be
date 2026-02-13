export enum WarehouseInches {
  INCH_6 = 6,
  INCH_8 = 8,
  INCH_10 = 10,
  INCH_12 = 12,
  INCH_14 = 14,
  INCH_16 = 16,
  INCH_18 = 18,
  INCH_20 = 20,
  INCH_22 = 22,
  INCH_24 = 24,
  INCH_26 = 26,
  INCH_28 = 28,
  INCH_30 = 30,
}

export enum WarehouseItem {
  CLOSURE = 'CLOSURE',
  FRONTAL = 'FRONTAL',
  WEFT = 'WEFT',
}

export enum WarehouseQuality {
  SDD = 'SDD',
  DD = 'DD',
  VIP = 'VIP',
  SINGLEDONOR = 'SINGLEDONOR',
  '2X4' = '2X4',
  '2X4_SINGLEDONOR' = '2X4 SINGLEDONOR',
  '2X6' = '2X6',
  '2X6_SINGLEDONOR' = '2X6 SINGLEDONOR',
  '5X5' = '5X5',
  '5X5_HD' = '5X5 HD',
  '5X5_SINGLEDONOR' = '5X5 SINGLEDONOR',
  '5X5_SINGLEDONOR_HD' = '5X5 SINGLEDONOR HD',
  '13X4' = '13X4',
  '13X4_HD' = '13X4 HD',
  '13X6' = '13X6',
  '13X6_HD' = '13X6 HD',
}

export enum WarehouseStyle {
  BONESTRAIGHT = 'BONESTRAIGHT',
  BONESTRAIGHT_LOI = 'BONESTRAIGHT LỖI',
  BOUNCE = 'BOUNCE',
  EGG_LOI = 'EGG LỖI',
  EGGCURLS = 'EGGCURLS',
}

export enum WarehouseColor {
  NATURAL = 'NATURAL',
  BROWN_COPPER = 'BROWN COPPER',
  BURGUNDY = 'BURGUNDY',
  GREY = 'GREY',
  PIANO_RED = 'PIANO RED',
  BURGUNDYN = 'BURGUNDYN',
  BROWN_TIP = 'BROWN TIP',
  BROWN_CU = 'BROWN CŨ',
  BROWN_LAN = 'BROWN LẪN',
}

export enum UnitOfCalculation {
  KG = 'Kg',
  PCS = 'Pcs',
}

export enum OrderState {
  BAO_GIA = 'báo giá',
  DA_CHOT = 'đã chốt',
  CHINH_SUA = 'chỉnh sửa',
  HOAN_TAC = 'hoàn tác',
}

export enum HistoryType {
  HOAN_TIEN = 'hoàn tiền',
  KHACH_TRA = 'khách trả',
}

export enum PaymentMethod {
  CHUYEN_KHOAN = 'Chuyển khoản',
  TIEN_MAT = 'Tiền mặt',
  THE = 'Thẻ',
  KHAC = 'Khác',
}

export enum OrderType {
  CAO = 'cao',
  THAP = 'thấp',
}