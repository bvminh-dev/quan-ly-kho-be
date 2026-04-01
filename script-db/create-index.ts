/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import mongoose from 'mongoose';

const MONGODB_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/quan-ly-kho';

interface IndexSpec {
    name: string;
    spec: Record<string, 1 | -1>;
    options?: mongoose.IndexOptions;
    reason: string;
}

interface CollectionIndexes {
    collection: string;
    indexes: IndexSpec[];
}

const indexDefinitions: CollectionIndexes[] = [
    // ========================================
    // USERS
    // ========================================
    {
        collection: 'users',
        indexes: [
            {
                name: 'idx_users_email_isDeleted',
                spec: { email: 1, isDeleted: 1 },
                options: { unique: true },
                reason:
                    'findByEmail: findOne({ email, isDeleted: false }) + đảm bảo unique email giữa các user active',
            },
            {
                name: 'idx_users_refreshToken_isDeleted',
                spec: { refreshToken: 1, isDeleted: 1 },
                options: { sparse: true },
                reason:
                    'findByRefreshToken: findOne({ refreshToken, isDeleted: false }) — sparse vì không phải user nào cũng có refreshToken',
            },
            {
                name: 'idx_users_isDeleted',
                spec: { isDeleted: 1 },
                reason:
                    'findAll / count: filter isDeleted=false + hỗ trợ sort createdAt',
            },
        ],
    },

    // ========================================
    // ROLES
    // ========================================
    {
        collection: 'roles',
        indexes: [
            {
                name: 'idx_roles_name_isDeleted',
                spec: { name: 1, isDeleted: 1 },
                options: { unique: true },
                reason:
                    'findByName: findOne({ name, isDeleted: false }) + đảm bảo unique role name',
            },
        ],
    },

    // ========================================
    // PERMISSIONS
    // ========================================
    {
        collection: 'permissions',
        indexes: [
            {
                name: 'idx_permissions_module_method_isDeleted',
                spec: { module: 1, method: 1, isDeleted: 1 },
                reason:
                    'findAll: filter theo module + method (dùng trong phân quyền, kiểm tra permission)',
            },
            {
                name: 'idx_permissions_apiPath_method_isDeleted',
                spec: { apiPath: 1, method: 1, isDeleted: 1 },
                reason:
                    'Lookup permission theo apiPath + method khi kiểm tra quyền truy cập API',
            },
        ],
    },

    // ========================================
    // CUSTOMERS
    // ========================================
    {
        collection: 'customers',
        indexes: [
            {
                name: 'idx_customers_name_isDeleted',
                spec: { name: 1, isDeleted: 1 },
                reason:
                    'findByName: findOne({ name, isDeleted: false }) — kiểm tra trùng tên customer',
            },
            {
                name: 'idx_customers_isDeleted',
                spec: { isDeleted: 1 },
                reason: 'findAll: filter isDeleted=false + sort createdAt',
            },
        ],
    },

    // ========================================
    // ORDERS — collection quan trọng nhất, nhiều query phức tạp
    // ========================================
    {
        collection: 'orders',
        indexes: [
            {
                name: 'idx_orders_state_deliveredAt_isDeleted',
                spec: { state: 1, deliveredAt: -1, isDeleted: 1 },
                reason:
                    'findForDashboard: { isDeleted: false, state: "DA_GIAO", deliveredAt: { $gte, $lte } } — query dashboard chạy thường xuyên',
            },
            {
                name: 'idx_orders_customer_state_createdAt_isDeleted',
                spec: { customer: 1, state: 1, createdAt: -1, isDeleted: 1 },
                reason:
                    'findLatestOrderIdsPerCustomer: aggregate $match { customer: $in, isDeleted: false, state: $in } + $sort { createdAt: -1 } + $group by customer',
            },
            {
                name: 'idx_orders_customer_state_isDeleted',
                spec: { customer: 1, state: 1, isDeleted: 1 },
                reason:
                    'calculateCustomerPayment: find({ customer, isDeleted: false, state: { $nin: ["BAO_GIA"] } }) — tính toán payment cho customer',
            },
            {
                name: 'idx_orders_state_createdAt_isDeleted',
                spec: { state: 1, createdAt: -1, isDeleted: 1 },
                reason:
                    'findAll: filter theo state + khoảng thời gian createdAt (createdFrom/createdTo) — query phổ biến từ OrderController',
            },
            {
                name: 'idx_orders_createdAt_isDeleted',
                spec: { createdAt: -1, isDeleted: 1 },
                reason:
                    'findAll: filter theo khoảng thời gian createdAt khi không filter theo state, sort -createdAt mặc định',
            },
            {
                name: 'idx_orders_type_isDeleted',
                spec: { type: 1, isDeleted: 1 },
                reason: 'findAll: filter theo order type (XUAT_KHO / NHAP_KHO)',
            },
            {
                name: 'idx_orders_createdBy_isDeleted',
                spec: { createdBy: 1, isDeleted: 1 },
                reason:
                    'findAll: filter theo createdBy + populate createdBy trong dashboard staff report',
            },
        ],
    },

    // ========================================
    // WAREHOUSES
    // ========================================
    {
        collection: 'warehouses',
        indexes: [
            // NOTE: Unique compound index { inchId, itemId, qualityId, styleId, colorId }
            // đã được định nghĩa trực tiếp trong warehouse.schema.ts — không tạo lại ở đây
            {
                name: 'idx_warehouses_inchId_isDeleted',
                spec: { inchId: 1, isDeleted: 1 },
                options: { sparse: true },
                reason:
                    'updateByCatalogId("inchId", catalogId) — updateMany({ inchId, isDeleted: false })',
            },
            {
                name: 'idx_warehouses_itemId_isDeleted',
                spec: { itemId: 1, isDeleted: 1 },
                options: { sparse: true },
                reason:
                    'updateByCatalogId("itemId", catalogId) — updateMany({ itemId, isDeleted: false })',
            },
            {
                name: 'idx_warehouses_qualityId_isDeleted',
                spec: { qualityId: 1, isDeleted: 1 },
                options: { sparse: true },
                reason:
                    'updateByCatalogId("qualityId", catalogId) — updateMany({ qualityId, isDeleted: false })',
            },
            {
                name: 'idx_warehouses_styleId_isDeleted',
                spec: { styleId: 1, isDeleted: 1 },
                options: { sparse: true },
                reason:
                    'updateByCatalogId("styleId", catalogId) — updateMany({ styleId, isDeleted: false })',
            },
            {
                name: 'idx_warehouses_colorId_isDeleted',
                spec: { colorId: 1, isDeleted: 1 },
                options: { sparse: true },
                reason:
                    'updateByCatalogId("colorId", catalogId) — updateMany({ colorId, isDeleted: false })',
            },
        ],
    },

    // ========================================
    // HISTORY ENTERS
    // ========================================
    {
        collection: 'historyenters',
        indexes: [
            {
                name: 'idx_historyenters_warehouseId_isDeleted',
                spec: { warehouseId: 1, isDeleted: 1 },
                reason:
                    'findAll: filter theo warehouseId + populate warehouse trong findById',
            },
            {
                name: 'idx_historyenters_type_isDeleted',
                spec: { type: 1, isDeleted: 1 },
                reason: 'findAll: filter theo type (Tạo mới, Bổ sung, Cập nhật giá...)',
            },
            {
                name: 'idx_historyenters_isDeleted_createdAt',
                spec: { isDeleted: 1, createdAt: -1 },
                reason: 'findAll: filter isDeleted=false + sort -createdAt (mặc định)',
            },
        ],
    },

    // ========================================
    // HISTORY EXPORTS
    // ========================================
    {
        collection: 'historyexports',
        indexes: [
            {
                name: 'idx_historyexports_orderId_isDeleted',
                spec: { orderId: 1, isDeleted: 1 },
                reason: 'findAll: filter theo orderId + populate order trong findById',
            },
            {
                name: 'idx_historyexports_warehouseId_isDeleted',
                spec: { warehouseId: 1, isDeleted: 1 },
                reason:
                    'findAll: filter theo warehouseId + populate warehouse trong findById',
            },
            {
                name: 'idx_historyexports_stateOrder_isDeleted',
                spec: { stateOrder: 1, isDeleted: 1 },
                reason: 'findAll: filter theo stateOrder (DANG_BAN, DA_GIAO, HOAN_TAT)',
            },
            {
                name: 'idx_historyexports_isDeleted_createdAt',
                spec: { isDeleted: 1, createdAt: -1 },
                reason: 'findAll: filter isDeleted=false + sort -createdAt (mặc định)',
            },
        ],
    },

    // ========================================
    // CATALOGS (inch, item, quality, color, style)
    // Tất cả đều có pattern giống nhau: findByCode + findAll
    // ========================================
    {
        collection: 'inches',
        indexes: [
            {
                name: 'idx_inches_code_isDeleted',
                spec: { code: 1, isDeleted: 1 },
                options: { unique: true },
                reason: 'findByCode: findOne({ code, isDeleted: false })',
            },
        ],
    },
    {
        collection: 'items',
        indexes: [
            {
                name: 'idx_items_code_isDeleted',
                spec: { code: 1, isDeleted: 1 },
                options: { unique: true },
                reason: 'findByCode: findOne({ code, isDeleted: false })',
            },
        ],
    },
    {
        collection: 'qualities',
        indexes: [
            {
                name: 'idx_qualities_code_isDeleted',
                spec: { code: 1, isDeleted: 1 },
                options: { unique: true },
                reason: 'findByCode: findOne({ code, isDeleted: false })',
            },
        ],
    },
    {
        collection: 'colors',
        indexes: [
            {
                name: 'idx_colors_code_isDeleted',
                spec: { code: 1, isDeleted: 1 },
                options: { unique: true },
                reason: 'findByCode: findOne({ code, isDeleted: false })',
            },
        ],
    },
    {
        collection: 'styles',
        indexes: [
            {
                name: 'idx_styles_code_isDeleted',
                spec: { code: 1, isDeleted: 1 },
                options: { unique: true },
                reason: 'findByCode: findOne({ code, isDeleted: false })',
            },
        ],
    },
];

async function createIndexes(): Promise<void> {
    console.log('Connecting to MongoDB...');
    console.log(`URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}`);

    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.\n');

    const db = mongoose.connection.db!;
    let totalCreated = 0;
    let totalSkipped = 0;
    let totalFailed = 0;

    for (const { collection, indexes } of indexDefinitions) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Collection: ${collection}`);
        console.log('='.repeat(60));

        for (const { name, spec, options = {}, reason } of indexes) {
            try {
                const collectionObj = db.collection(collection);
                await collectionObj.createIndex(spec, {
                    name,
                    ...options,
                } as mongoose.mongo.CreateIndexesOptions);
                console.log(`  [CREATED] ${name}`);
                console.log(`    Keys: ${JSON.stringify(spec)}`);
                console.log(`    Reason: ${reason}`);
                totalCreated++;
            } catch (error: any) {
                if (error.codeName === 'IndexOptionsConflict' || error.code === 85) {
                    console.log(
                        `  [SKIPPED] ${name} — already exists with different options`,
                    );
                    totalSkipped++;
                } else {
                    console.log(`  [FAILED] ${name} — ${error.message}`);
                    totalFailed++;
                }
            }
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`  Created: ${totalCreated}`);
    console.log(`  Skipped: ${totalSkipped}`);
    console.log(`  Failed:  ${totalFailed}`);
    console.log(`  Total:   ${totalCreated + totalSkipped + totalFailed}`);

    await mongoose.disconnect();
    console.log('\nDone. Disconnected from MongoDB.');
}

createIndexes().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
