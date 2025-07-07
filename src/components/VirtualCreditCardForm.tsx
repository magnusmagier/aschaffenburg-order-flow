import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Building2, Euro, AlertTriangle, Printer } from "lucide-react";
import { toast } from "sonner";
import { useOrderNumberContext } from "./OrderNumberContext";

interface VirtualCreditCardFormData {
  // Organization Information
  organizationUnit: string;
  costCenter: string;
  
  // Service Specification
  serviceDescription: string;
  supplier: string;
  estimatedAmount: number;
  
  // Delivery Information
  deliveryCountry: string;
  
  // Legal Agreements
  euRegulationAgreement: boolean;
  orderingAgreement: boolean;
  
  // Additional Information
  notes: string;
  requestDate: string;
  orderNumber: string;
  responsiblePerson: string;
  amountNet: number;
  amountGross: number;
  orderLink: string;
  location: string;
  orderAttached: boolean;
}

export const VirtualCreditCardForm = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<VirtualCreditCardFormData>({
    defaultValues: {
      organizationUnit: "Technische Hochschule Aschaffenburg",
      costCenter: "6606105",
      deliveryCountry: "deutschland",
      requestDate: new Date().toISOString().split('T')[0],
      euRegulationAgreement: false,
      orderingAgreement: false,
      orderNumber: "",
      responsiblePerson: "",
      amountNet: 0,
      amountGross: 0,
      orderLink: "",
      location: "",
      orderAttached: false
    }
  });

  const euRegulationAgreement = watch('euRegulationAgreement');
  const orderingAgreement = watch('orderingAgreement');
  const estimatedAmount = watch('estimatedAmount') || 0;
  const { orderNumber, setOrderNumber } = useOrderNumberContext();

  const handlePrint = () => {
    window.print();
  };

  const onSubmit = (data: VirtualCreditCardFormData) => {
    if (!euRegulationAgreement || !orderingAgreement) {
      toast.error("Bitte bestätigen Sie alle erforderlichen Vereinbarungen.");
      return;
    }

    const cardRequest = {
      ...data,
      timestamp: new Date().toISOString(),
      status: "pending"
    };
    
    console.log("Virtual credit card request submitted:", cardRequest);
    toast.success("Antrag für virtuelle Kreditkarte erfolgreich eingereicht!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Kopfbereich als Tabelle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-university">Bestellformular „Virtuelle Kreditkarte“ für Online-Bestellungen</CardTitle>
          <CardDescription>Höchstwert: 5000,- EUR</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border text-sm">
              <tbody>
                <tr className="bg-muted">
                  <td className="border px-2 py-1 w-1/3"><Label>Organisationseinheit / Bestellnummer</Label></td>
                  <td className="border px-2 py-1 w-1/3"><Label>Sachbearbeitung</Label></td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">
                    <Input id="organizationUnit" {...register("organizationUnit", { required: "Organisationseinheit ist erforderlich" })} placeholder="z.B. Labor für nutzeradaptive Systeminteraktion" />
                    <div className="space-y-2">
                      <Label htmlFor="orderNumber">Bestellnummer</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="orderNumber"
                          value={orderNumber}
                          onChange={e => setOrderNumber(e.target.value)}
                          placeholder="z.B. 25THAxxxxxxxxxxxxxxxxxxxxx"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setOrderNumber(generateUniqueOrderNumber())}
                        >
                          Auftragsnummer generieren
                        </Button>
                      </div>
                    </div>
                  </td>
                  <td className="border px-2 py-1">
                    <Input id="responsiblePerson" {...register("responsiblePerson", { required: false })} placeholder="z.B. Max Mustermann" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Kurzbeschreibung der Leistung */}
          <div className="mb-4">
            <Label>Kurzbeschreibung der Leistung</Label>
            <Textarea id="serviceDescription" {...register("serviceDescription", { required: "Leistungsbeschreibung ist erforderlich" })} placeholder="Beschreibung der zu bestellenden Leistung/Artikel..." rows={2} />
          </div>
          {/* Lieferant, Auftragswert netto/brutto, Link */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Lieferant</Label>
              <Input id="supplier" {...register("supplier", { required: "Lieferant ist erforderlich" })} placeholder="Name des Lieferanten" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amountNet">Auftragswert (netto)</Label>
              <Input id="amountNet" type="number" step="0.01" {...register("amountNet", { required: "Netto-Betrag ist erforderlich" })} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amountGross">Auftragswert (brutto)</Label>
              <Input id="amountGross" type="number" step="0.01" {...register("amountGross", { required: "Brutto-Betrag ist erforderlich" })} placeholder="0.00" />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="orderLink">Link</Label>
              <Input id="orderLink" {...register("orderLink", { required: false })} placeholder="z.B. https://shop.de/artikel" />
            </div>
          </div>
          {/* Lieferland-Auswahl */}
          <div className="mb-4">
            <Label>Die Bestellung erfolgt in</Label>
            <div className="flex gap-4 mt-2">
              <label><input type="radio" value="deutschland" {...register("deliveryCountry")} /> Deutschland</label>
              <label><input type="radio" value="eu" {...register("deliveryCountry")} /> EU-Land</label>
              <label><input type="radio" value="drittland" {...register("deliveryCountry")} /> Drittland</label>
            </div>
          </div>
          {/* Hinweise zu USt-ID/EORI */}
          <div className="text-sm text-warning font-semibold mb-2">Bei Bestellungen im EU-Ausland oder Drittland ist unbedingt immer die USt-ID-Nr (VAT) DE 121098123 anzugeben. Muss die Warenlieferung zollrechtlich behandelt werden, ist auch die EORI-Nr. DE721632 bei der Bestellung anzugeben.</div>
          {/* Checkbox Bestellung beigefügt */}
          <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" id="orderAttached" {...register("orderAttached")}/>
            <Label htmlFor="orderAttached">Die Bestellung ist beigefügt.</Label>
          </div>
          {/* Ort und Unterschriften */}
          <div className="flex flex-col gap-8 mt-8">
            <div className="flex flex-col md:flex-row gap-8 justify-between">
              <div className="flex-1 flex flex-col items-center">
                <div className="border-b-2 border-muted h-8 w-full mb-1" />
                <Label className="block text-center mt-1">Unterschrift</Label>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="border-b-2 border-muted h-8 w-full mb-1" />
                <Label className="block text-center mt-1">Unterschrift Kostenstellenverantwortliche/r</Label>
              </div>
            </div>
            <div className="mt-6">
              <Label htmlFor="notes">Anmerkung der Abteilung Haushalt</Label>
              <Textarea id="notes" {...register("notes")} placeholder="..." rows={3} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end space-x-4 print:hidden">
        <Button type="button" variant="outline">
          Entwurf speichern
        </Button>
        <Button type="button" variant="outline" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Drucken
        </Button>
        <Button 
          type="submit" 
          className="bg-gradient-primary"
          disabled={!euRegulationAgreement || !orderingAgreement}
        >
          Antrag einreichen
        </Button>
      </div>
    </form>
  );
};

// Hilfsfunktion für 25-stellige eindeutige Nummer
function generateUniqueOrderNumber() {
  const year = new Date().getFullYear().toString().slice(-2);
  const department = "THA";
  const unique = (window.crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString()).replace(/-/g, '').slice(0, 20);
  return `${year}${department}${unique}`.slice(0, 25);
}