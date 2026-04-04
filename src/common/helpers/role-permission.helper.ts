export interface ApiPermission {
  _id: string;
  apiPath: string;
  method: string;
}

/**
 * Kiểm tra xem user có thể view tất cả data hay không
 * @param roleName - Tên role (admin = luôn view all)
 * @param isViewAllUser - Flag isViewAllUser của role
 * @param viewAllUserApis - Danh sách APIs được phép view all
 * @param currentApiPath - API path hiện tại
 * @param currentMethod - HTTP method hiện tại
 * @returns true nếu được phép view all, false nếu chỉ xem data của mình
 */
export function canViewAllData(
  roleName: string,
  isViewAllUser: boolean,
  viewAllUserApis: ApiPermission[],
  currentApiPath: string,
  currentMethod: string,
): boolean {
  // Admin role luôn view all data
  if (roleName.toLowerCase() === 'admin') {
    return true;
  }

  // Nếu isViewAllUser = false, chỉ view data của mình
  if (!isViewAllUser) {
    return false;
  }

  // Check nếu API hiện tại có trong danh sách viewAllUserApis
  const apiInList = viewAllUserApis?.some(
    (api) =>
      api.apiPath === currentApiPath &&
      api.method.toUpperCase() === currentMethod.toUpperCase(),
  );

  return apiInList;
}
