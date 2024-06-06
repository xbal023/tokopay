export interface ITokopay {
  setName: (newName: string) => this;
  setUrl: (newUrl: string) => this;
  getAccountInfo: () => Promise<ResponseTokopay>;
  newTransactionSimple: (
    opts: TransactionSimpleOpts
  ) => Promise<SimpleResponseTokopay>;
  newTransaction: (opts: TransactionOpts) => Promise<ResponseTokopay>;
  statusTransaction: (
    reffId: string,
    nominal: number,
    methode: PaymentMethod
  ) => Promise<SimpleResponseTokopay>;
}

export interface SimpleResponseTokopay {
  status: string;
  data: any;
}

type MethodeVirtualAcc =
  | "BRIVA"
  | "BCAVA"
  | "BNIVA"
  | "PERMATAVA"
  | "PERMATAVAA"
  | "CIMBVA"
  | "DANAMONVA"
  | "BSIVA"
  | "BNCVA";

type MethodeEmoney = "SHOPEEPAY" | "GOPAY" | "DANA" | "LINKAJA";
type MethodeQRIS = "QRIS" | "QRISREALTIME" | "QRIS_REALTIME_NOBU";

type MethodeRetail = "ALFAMART" | "INDOMARET";
type MethodePulsa = "TELKOMSEL" | "AXIS" | "XL" | "TRI";

export type PaymentMethod =
  | MethodeVirtualAcc
  | MethodeEmoney
  | MethodeQRIS
  | MethodeRetail
  | MethodePulsa;

export interface TransactionOpts {
  channelCode: string;
  amount: number;
  reffId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  expiredTime: number;
  redirectUrl?: string;
  signature: string;
  items?: Array<any>;
}

export interface TransactionSimpleOpts {
  nominal: number;
  methode: PaymentMethod;
  reffId?: string;
}
export type ResponseTokopay = {
  status: 0 | 1;
  rc: number;
  message?: string;
  error_msg?: string;
  data?: any;
};
