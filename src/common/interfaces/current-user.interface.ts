export interface ICurrentUser {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
    isViewAllUser: boolean;
    viewAllUserApis: Array<{ _id: string; apiPath: string; method: string }>;
  };
  permissions: {
    _id: string;
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }[];
}
