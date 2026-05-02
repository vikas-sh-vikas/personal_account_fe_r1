type User = {
  name: string;
  email: string;
  photo: string;
  mobileNo?: string;
};

interface UserState {
  user: User;
  updateUserState: (user: UserModel) => void;
  toggle?: boolean;
  updateToggle?: () => void;
}

type Inputs = {
  email: string;
  password: string;
};
type ForgotPasswordInputs = {
  registerEmail: string;
  password: string;
  reEnterPassword: string;
};

interface Bank {
  _id: string;
  name: string;
  // icon: JSX.Element;
}

interface Transaction {
  _id?: string;
  type: string;
  amount: string;
  category: string;
  paymentMethod: string;
  description?: string;
  bank?: string;
  date: Date;
}
interface TransactionReport {
  _id?: string;
  type: string;
  typeName?: string;
  amount: string;
  category: string;
  categoryName?: string;
  paymentMethod: string;
  paymentMethodName?: string;
  description?: string;
  bank?: string;
  bankName?: string;
  date: Date;
}
interface BankDetail {
  _id?: string;
  bankName: string;
  branch?: string;
  currentBalance: string;
  openingBalance?: string;
  ifcsCode: string;
  address?: string;
}
interface DepositDetail {
  _id?: string;
  amount: string;
  bankId: string;
}
interface SelfTransferDetail {
  _id?: string;
  amount: string;
  fromBankId: string;
  toBankId: string;
}
interface AddEditCash {
  _id?: string;
  cash: string;
}

interface DropDownOptions {
  value: string;
  label: string;
}
type TScreen = {
  width: number;
  height: number;
};
type TFilterModel = {
  id?: number;
  totalRows: number;
  pageSize: number;
  currentPage: number;
  searchText: string;
  filterRowsCount: number;
  orderType: string;
  orderBy: string;
  fromDate?: Date;
  toDate?: Date;
};

type TCheckPrevilege = {
  id: number;
  menuid: number;
  privilegeId: number;
  privilegeName: string;
  roleId: number;
  privilegeUniqueId: string;
};
type TDropdownOption = {
  key?: string | number;
  value: any;
  text?: string;
  data?: any;
  icon?: any;
  label: string;
  paramUniqueId?: string;
};
