import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {
  Invoice,
  InvoiceViewModel,
  InvoiceDetail,
  InvoiceDetailViewModel,
  initialInvoiceData,
  storageInvoiceDetailKey,
  storageInvoicesKey,
  InvoiceDetailEntryModel,
  InvoiceEntryModel
} from "./app/models/app-models";

function App() {

  const [prefix, setPrefix] = useState('TRY');
  const [invoiceData, setInvoiceData] = useState<Array<Invoice>>(
    initialInvoiceData
  );
  const [invoiceList, setInvoiceList] = useState<Array<InvoiceViewModel>>([]);

  const [selectedDetails, setSelectedDetails] = useState<
    Array<InvoiceDetailViewModel>
  >([]);

  const [invoiceDetailData, setInvoiceDetailData] = useState<
    Array<InvoiceDetail>
  >([]);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [currentInvoiceDetailEntry, setCurrentInvoiceDetailEntry] = useState<
    InvoiceDetailEntryModel
  >(new InvoiceDetailEntryModel());
  const [currentInvoiceEntry, setCurrentInvoiceEntry] = useState<
    InvoiceEntryModel
  >(new InvoiceEntryModel());

  //Seçili Faturanın Detayını Görme
  const calcInvoices = () => {
    invoiceData.forEach(function (refInvoice) {
      let calcdisc = 0;
      let calctotal = 0;
      const refDetails = invoiceDetailData.filter(
        (details) => details.InvoiceId === refInvoice.InvoiceId
      );
      refDetails.forEach(function (refdetail) {
        const lineDiscount = Number(refdetail.ItemLineDiscount);
        const total = Number(refdetail.ItemPrice * refdetail.ItemQuantity);
        const vatAmount = total * 0.08;
        calcdisc += lineDiscount;
        calctotal += total + vatAmount - lineDiscount;
      });
      refInvoice.TotalAmount = calctotal;
      refInvoice.TotalDiscount = calcdisc;
      refInvoice.TotalVatRate = 8;
    });
    const cloned = _.cloneDeep(invoiceData);
    setInvoiceData(cloned);
  };
  //Fatura başlık kaydını restore eder.
  const restoreInvoices = () => {
    const jsonStr = localStorage.getItem(storageInvoicesKey);
    if (jsonStr) {
      const data = JSON.parse(jsonStr);
      setInvoiceData(data);
    }
  };
  //Fatura Detaylarını restore eder
  const restoreInvoiceDetails = () => {
    console.log("restoreInvoiceDetails called ");
    const jsonStr = localStorage.getItem(storageInvoiceDetailKey);
    if (jsonStr) {
      const data = JSON.parse(jsonStr);
      setInvoiceDetailData(data);
    }
  };

  useEffect(() => {
    restoreInvoices();
    restoreInvoiceDetails();
  }, []);

  const selectInvoice = (invoice: InvoiceViewModel) => {
    setSelectedInvoice(invoice);
  };

  //Fatura Detayını Kayıt eden metot
  const saveDetail = () => {
    console.log(
      "saveDetail -> saveDetail currentInvoiceDetailEntry ",
      currentInvoiceDetailEntry
    );
    const invoiceDetail = new InvoiceDetail();

    const {
      invoiceId,
      name,
      quantity,
      price,
      lineDiscount
    } = currentInvoiceDetailEntry;
    if (invoiceId && invoiceId.trim()) {
      console.log("has invoiceid");
      invoiceDetail.InvoiceId = parseInt(invoiceId);
    } else {
      alert("Fatura numarası zorunlu.");
      return;
    }

    if (name && name.trim()) {
      invoiceDetail.ItemName = name.toString();
    } else {
      alert("Ürün ismi zorunlu.");
      return;
    }

    if (quantity && quantity.trim()) {
      invoiceDetail.ItemQuantity = Number(quantity);
    } else {
      alert("Ürün miktarı zorunlu.");
      return;
    }

    if (price && price.toString().trim()) {
      invoiceDetail.ItemPrice = Number(price);
    } else {
      alert("Ürün fiyatı zorunlu.");
      return;
    }

    invoiceDetail.ItemVatRate = 8;
    invoiceDetail.ItemLineDiscount =
      lineDiscount && lineDiscount.trim() ? Number(lineDiscount.trim()) : 0;
    console.log(invoiceDetail);
    console.log("before save detail", invoiceDetailData);
    //burada datanin dolu ollmasi gerekiyor ama bos geliyor onceki data
    const newData = _.cloneDeep(invoiceDetailData);
    newData.push(invoiceDetail);
    console.log("new Data", newData);
    setInvoiceDetailData(newData);
    calcInvoices();
  };
  //Fatura başlık Kaydetme
  const saveHead = () => {
    const invoice = new Invoice();
    const { id, customer, number } = currentInvoiceEntry;
    if (id && id.trim()) {
      if (invoiceData.find((d) => d.InvoiceId === invoice.InvoiceId)) {
        alert("Bu id ye ait fatura mevcut");
        return;
      } else {
        invoice.InvoiceId = parseInt(id);
      }
    } else {
      alert("Fatura id si zorunlu.");
      return;
    }

    if (customer && customer.trim()) {
      invoice.CustomerName = customer.trim();
    } else {
      alert("Müşeri adı zorunlu.");
      return;
    }

    if (number && number.toString().trim()) {
      invoice.InvoiceNumber = number.toString();
    } else {
      alert("Fatura no zorunlu.");
      return;
    }

    invoice.TotalAmount = 0;
    invoice.TotalVatRate = 0;
    invoice.TotalDiscount = 0;
    const newData = [...invoiceData];
    newData.push(invoice);
    setInvoiceData(newData);
  };

  //invoicelData Listesinde bir değişiklik olduğunda tetiklenen event
  useEffect(() => {
    if (invoiceData) {
      const _invoiceList = invoiceData.map((il) => new InvoiceViewModel(il));
      setInvoiceList(_invoiceList);
      localStorage.setItem(storageInvoicesKey, JSON.stringify(invoiceData));
    }
  }, [invoiceData]);

  //invoiceDetailData Listesinde bir değişiklik olduğunda tetiklenen event
  const updateSelectedInvoiceDetailsList = () => {
    if (selectedInvoice) {
      const targetDetails = invoiceDetailData.filter(
        (detail) => detail.InvoiceId === selectedInvoice?.InvoiceId
      );
      if (targetDetails) {
        setSelectedDetails(targetDetails);
      }
    }
  };

  useEffect(() => {
    console.log("useEffect -> invoiceDetailData", invoiceDetailData);
    if (invoiceDetailData) {
      updateSelectedInvoiceDetailsList();
      localStorage.setItem(
        storageInvoiceDetailKey,
        JSON.stringify(invoiceDetailData)
      );
      calcInvoices();
    }
  }, [invoiceDetailData]);

  useEffect(() => {
    updateSelectedInvoiceDetailsList();
  }, [selectedInvoice]);

  //Silme İşlemi için event
  const deleteInvoice = (invoice: InvoiceViewModel) => {
    const targetDetails = invoiceDetailData.filter(
      (detail) => detail.InvoiceId === invoice.InvoiceId
    );
    targetDetails.forEach(function (detail) {
      const InvoiceDetailindex = invoiceDetailData.indexOf(detail);
      invoiceDetailData.splice(InvoiceDetailindex, 1);
      localStorage.setItem(
        storageInvoiceDetailKey,
        JSON.stringify(invoiceDetailData)
      );
      restoreInvoiceDetails();
    });
    const invoiceIndex = invoiceData.indexOf(invoice);
    invoiceData.splice(invoiceIndex);
    localStorage.setItem(storageInvoicesKey, JSON.stringify(invoiceData));
    restoreInvoices();
  };
  //Detay Listesi toggle işlemi
  const toggleDetailTable = (invoice: InvoiceViewModel) => {
    const table = document.getElementById("tableDetail");
    if (table?.classList.contains("hide")) {
      table.classList.remove("hide");
      table.classList.add("mystyle");
    } else {
      table?.classList.add("hide");
    }
    selectInvoice(invoice);
  };

  useEffect(() => {
    console.log("currentInvoiceDetailEntry", currentInvoiceDetailEntry);
  }, [currentInvoiceDetailEntry]);

  return (
    <div className="App">
      <div className="container">
       <div className="row">
        <div className="col">
          <div className="form-group">
          <h2>Fatura Başlık Kaydı</h2>
          <div className="input-group mb-3"> 
          <div className="row col-12">
          <label>Fatura Id  </label>
            <input type="text" id="fInvoiceId" className="form-control" onChange={(ev) =>
                setCurrentInvoiceEntry({
                  ...currentInvoiceEntry,
                  id: ev.target.value.trim()
                })
              }
            />
          </div>
          <div className="row col-12">
          <label>Fatura No  </label><br/> 
            <input type="text" id="fInvoiceNumber" className="form-control" onChange={(ev) =>
                setCurrentInvoiceEntry({
                  ...currentInvoiceEntry,
                  number: Number(ev.target.value.toString().trim())
                })
              }
            />
          </div>
          <div className="row col-12">
          <label>Müşteri Adi </label>
            <input 
              type="text"
              id="fCustomerName" className="form-control"
              onChange={(ev) =>
                setCurrentInvoiceEntry({
                  ...currentInvoiceEntry,
                  customer: ev.target.value.trim()
                })
              }
            />
          </div>
            <div className="row col">
            <button type="button" className="form-group" style={{marginTop:20}}  onClick={saveHead}>
              Kaydet
            </button>
            </div>
          </div>
             </div>
          </div>
          <div className="col">
            <div className="input-group mb-3">
            <h2>Fatura Detay Kaydı</h2>
             <div className="row col-12">
             <label>FaturaId </label>
            <input 
              type="text"
              id="fInvoiceIdForDetail"
              className="form-control"
              onChange={(ev) =>
                setCurrentInvoiceDetailEntry({
                  ...currentInvoiceDetailEntry,
                  invoiceId: ev.target.value.trim()
                })
              }
            />
             </div>
              <div className="row col-12">
              <label>Ürün Adı </label>
            <input
              type="text"
              id="fItemName"
              className="form-control"
              onChange={(ev) =>
                setCurrentInvoiceDetailEntry({
                  ...currentInvoiceDetailEntry,
                  name: ev.target.value.trim()
                })
              }
            />
              </div>
              <div className='row col-12'>
              <label>Ürün Fiyatı </label>
            <input 
              type="text"
              id="fItemPrice"
              className="form-control"
              prefix ={prefix}
              step={1}
              onChange={(ev) =>
                setCurrentInvoiceDetailEntry({
                  ...currentInvoiceDetailEntry,
                  price: ev.target.value.trim()
                })
              }
            />
              </div>
              <div className="row col-12">
              <label>Ürün Miktarı  </label>
            <input 
              type="text"
              id="fItemQuantity"
              className="form-control"
              onChange={(ev) =>
                setCurrentInvoiceDetailEntry({
                  ...currentInvoiceDetailEntry,
                  quantity: ev.target.value.trim()
                })
              }
            />
              </div>
            <div className="row col-12">
            <label>İndirim </label>
            <input 
              type="text"
              id="fItemDiscount"
              className="form-control"
              onChange={(ev) =>
                setCurrentInvoiceDetailEntry({
                  ...currentInvoiceDetailEntry,
                  lineDiscount: ev.target.value.trim()
                })
              }
            />
            </div>
           <div className="row col 6">
           <button type="button" style={{marginTop:20}} onClick={saveDetail}>
              Kaydet
            </button>
           </div>
            </div>
          </div>
        </div>
          <div className='row'>
          <div className='col'>
          <table className="table table-hover table-dark">
            <thead>
              <tr>
                <th>Fatura ID</th>
                <th>FATURA NO</th>
                <th>MÜŞTERİ ADI</th>
                <th>KDV ORAN</th>
                <th>INDIRIM TUTARI</th>
                <th>TOPLAM TUTAR</th>
                <th>İŞLEMLER</th>
              </tr>
            </thead>
            <tbody>
              {invoiceList.map((x, i) => (
                <tr
                  key={i.toString()}
                  className={
                    selectedInvoice?.InvoiceId === x.InvoiceId
                      ? "selectedRow"
                      : undefined
                  }
                >
                  <td>{x.InvoiceId}</td>
                  <td>{x.InvoiceNumber}</td>
                  <td>{x.CustomerName}</td>
                  <td>{x.TotalVatRate}</td>
                  <td>{x.TotalDiscount}TL</td>
                  <td>{x.TotalAmount}TL</td>
                  <td>
                    <button
                      onClick={() => {
                        toggleDetailTable(x);
                      }}
                    >
                      Detayı Gör/Gizle
                    </button>
                    <button
                      onClick={() => {
                        deleteInvoice(x);
                      }}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className='col'>
          {selectedDetails && (
            <div>
              <h2>Fatura Detay</h2>
              <table id="tableDetail" className="table table-hover table-dark hide">
                <thead>
                  <tr>
                    <th>Fatura ID</th>
                    <th>Ürün Adı</th>
                    <th>Ürün Miktarı</th>
                    <th>Ürün Fiyatı</th>
                    <th>Ürün İndirimi</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDetails.map((d, i) => (
                    <tr key={i.toString()}>
                      <td>{d.InvoiceId}</td>
                      <td>{d.ItemName}</td>
                      <td>{d.ItemQuantity}</td>
                      <td>{d.ItemPrice}TL</td>
                      <td>{d.ItemLineDiscount}TL</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
          </div>
      </div>
    </div>
  );
}
export default App;
