import React from "react";
import { OrderForm } from "../components/OrderForm";

const sampleDefaultValues = {
  supplierName: "Völkner Elektronik",
  supplierAddress: "Sachsenstraße 2-4, 90469 Nürnberg",
  supplierFax: "+49 (0)911-1234567",
  items: [
    { id: "1", artikelnummer: "Y618292", description: "VOLTCRAFT VC 37 SE Zweipoliger Spannungsprüfer CAT III LED", quantity: 2, unitPrice: 12.98, total: 25.96 },
    { id: "2", artikelnummer: "S92832", description: "IVT Drehzahl- und Leistungsregler DR-2000", quantity: 1, unitPrice: 72.04, total: 72.04 },
    { id: "3", artikelnummer: "41215", description: "VOSS.pet fenci M09 - 230V Weidezaungerät", quantity: 1, unitPrice: 75.90, total: 75.90 }
  ],
  chapter: "1532",
  titleTG: "987654",
  costCenter: "6606105",
  kostentraeger: "",
  ausgabeartAZA: "",
  costType: "682100",
  mittelBetrag: 206.94,
  unternehmerischVerwendung: "nein",
  unternehmerischProzent: 0,
  orderNumber: "",
  orderDate: new Date().toISOString().split('T')[0],
  shippingCost: 0,
  taxRate: 19,
  notes: "",
};

const SampleOrder: React.FC = () => {
  // Optionale Logik: Beim Laden das Formular mit Beispieldaten füllen
  // (Alternativ: Die Logik kann auch direkt im OrderForm implementiert werden, wenn ein "sample"-Prop übergeben wird)
  // Hier nur die Seite als Wrapper
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Probebestellung: Völkner Elektronik</h1>
      <OrderForm defaultValues={sampleDefaultValues} />
    </div>
  );
};

export default SampleOrder; 