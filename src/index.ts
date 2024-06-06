import MD5 from "crypto-js/md5.js";
import crypto from "crypto";
import { fetch } from "undici";
import {
  ITokopay,
  PaymentMethod,
  ResponseTokopay,
  SimpleResponseTokopay,
  TransactionOpts,
  TransactionSimpleOpts,
} from "./types/tokopay";

export class Tokopay implements ITokopay {
  public _url: string;
  constructor(
    private secret: string,
    private merchant: string,
    private _name?: string
  ) {
    this._url = "https://api.tokopay.id/v1";
  }

  setName(newName: string) {
    this._name = newName;
    return this;
  }

  setUrl(newUrl: string) {
    this._url = newUrl;
    return this;
  }

  static generateReffID(...gen: string[]): string {
    return [...gen, crypto.randomUUID()].join("-");
  }

  createSignature(...strKeys: Array<string>) {
    let message = [this.merchant, this.secret, ...strKeys].join(":");
    return MD5(message).toString();
  }

  getAccountInfo() {
    return new Promise<ResponseTokopay>((resolve, reject) => {
      fetch(`${this._url}/merchant`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          merchant_id: this.merchant,
          signature: this.createSignature(),
        }),
      })
        .then((response) => response.json())
        .then((value) => resolve(value as ResponseTokopay))
        .catch((err) => reject(err));
    });
  }

  newTransactionSimple(opts: TransactionSimpleOpts) {
    return new Promise<SimpleResponseTokopay>((resolve, reject) => {
      let queries: string = new URLSearchParams({
        merchant: this.merchant,
        secret: this.secret,
        ref_id: opts.reffId ?? Tokopay.generateReffID(this._name ?? "tokopay"),
        nominal: String(opts.nominal),
        metode: opts.methode,
      }).toString();
      console.log(queries);
      fetch(`${this._url}/order?${queries}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((value) => resolve(value as SimpleResponseTokopay))
        .catch((err) => reject(err));
    });
  }

  newTransaction(opts: TransactionOpts) {
    return new Promise<ResponseTokopay>((resolve, reject) => {
      let _reffId =
        opts.reffId ?? Tokopay.generateReffID(this._name ?? "tokopay");
      let _expiredTime = opts.expiredTime;
      fetch(`${this._url}/order`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          merchant_id: this.merchant,
          kode_channel: opts.channelCode,
          reff_id: _reffId,
          amount: opts.amount,
          customer_name: opts.customerName,
          customer_email: opts.customerEmail,
          customer_phone: opts.customerPhone,
          redirect_url: opts.redirectUrl,
          expired_ts: _expiredTime,
          signature: this.createSignature(_reffId),
          items: opts.items,
        }),
      })
        .then((response) => response.json())
        .then((value) => resolve(value as ResponseTokopay))
        .catch((err) => reject(err));
    });
  }

  statusTransaction(reffId: string, nominal: number, methode: PaymentMethod) {
    return new Promise<SimpleResponseTokopay>((resolve, reject) => {
      let queries: string = new URLSearchParams({
        merchant: this.merchant,
        secret: this.secret,
        ref_id: reffId,
        nominal: String(nominal),
        metode: methode,
      }).toString();
      fetch(`${this._url}/order?${queries}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((value) => resolve(value as SimpleResponseTokopay))
        .catch((err) => reject(err));
    });
  }

  withdrawBalance(amount: number) {
    return new Promise<ResponseTokopay>((resolve, reject) => {
      fetch(`${this._url}/tarik-saldo`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          nominal: amount,
          merchant_id: this.merchant,
          signature: this.createSignature(String(amount)),
        }),
      })
        .then((response) => response.json())
        .then((value) => resolve(value as ResponseTokopay))
        .catch((err) => reject(err));
    });
  }
}

export default Tokopay;
