export class Invoice {
    InvoiceId: number = 0;
    InvoiceNumber: string = "";
    CustomerName: string = "";
    TotalAmount: number = 0;
    TotalVatRate: number = 0;
    TotalDiscount: number = 0;
  }
  export class InvoiceViewModel {
    InvoiceId: number;
    InvoiceNumber: string;
    CustomerName: string;
    TotalAmount: number;
    TotalVatRate: number;
    TotalDiscount: number;
    constructor(data: Invoice) {
      this.InvoiceId = data.InvoiceId;
      this.InvoiceNumber = data.InvoiceNumber;
      this.CustomerName = data.CustomerName;
      this.TotalAmount = data.TotalAmount;
      this.TotalVatRate = data.TotalVatRate;
      this.TotalDiscount = data.TotalDiscount;
    }
  }
  export class InvoiceDetail {
    InvoiceId: number = 0;
    ItemNumber: string = "";
    ItemName: string = "";
    ItemQuantity: number = 0;
    ItemPrice: number = 0;
    ItemVatRate: number = 0;
    ItemLineDiscount: number = 0;
  }
  export class InvoiceDetailViewModel {
    InvoiceId: number;
    ItemNumber: string;
    ItemName: string;
    ItemQuantity: number;
    ItemPrice: number;
    ItemVatRate: number;
    ItemLineDiscount: number;
    constructor(data: InvoiceDetail) {
      this.InvoiceId = data.InvoiceId;
      this.ItemNumber = data.ItemNumber;
      this.ItemName = data.ItemName;
      this.ItemQuantity = data.ItemQuantity;
      this.ItemPrice = data.ItemPrice;
      this.ItemVatRate = data.ItemVatRate;
      this.ItemLineDiscount = data.ItemLineDiscount;
    }
  }
  
  export class InvoiceDetailEntryModel {
    invoiceId: string = "";
    number: string = "";
    name: string = "";
    quantity: string = "";
    price: string = "";
    vatRate: string = "";
    lineDiscount: string = "";
  }
  
  export class InvoiceEntryModel {
    id: string = "";
    number: string = "";
    customer: string = "";
  }
  
  export const initialInvoiceData: Array<Invoice> = [
    {
      InvoiceId: 1,
      InvoiceNumber: "PR01",
      CustomerName: "OGUZ DEMIR",
      TotalAmount: 0,
      TotalVatRate: 8,
      TotalDiscount: 0
    },
    {
      InvoiceId: 2,
      InvoiceNumber: "PR02",
      CustomerName: "HAYDAR BOYALI",
      TotalAmount: 0,
      TotalVatRate: 8,
      TotalDiscount: 0
    },
    {
      InvoiceId: 3,
      InvoiceNumber: "PR03",
      CustomerName: "OZGUR OZTURK",
      TotalAmount: 0,
      TotalVatRate: 8,
      TotalDiscount: 0
    }
  ];
  
  export const storageInvoicesKey = "InvoiceKey";
  export const storageInvoiceDetailKey = "InvoiceDetailsKey";
  