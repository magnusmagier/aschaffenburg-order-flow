import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Building2, MapPin, Calculator, Printer, Info } from "lucide-react";
import { toast } from "sonner";
import { expenseCategories } from "@/data/expenseCategories";
import { Switch } from "@/components/ui/switch";
import { v4 as uuidv4 } from 'uuid';
import { useOrderNumberContext } from "./OrderNumberContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OrderItem {
  id: string;
  artikelnummer?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface OrderFormData {
  // Supplier Information
  supplierName: string;
  supplierAddress: string;
  supplierFax: string;
  
  // Delivery Information
  deliveryBuilding: string;
  deliveryRoom: string;
  contactPerson: string;
  contactPhone: string;
  contactFax: string;
  
  // Financial Information
  chapter: string;
  titleTG: string;
  costCenter: string;
  costType: string;
  
  // Order Items
  items: OrderItem[];
  
  // Additional Information
  shippingCost: number;
  taxRate: number;
  notes: string;

  // Skonto
  skontoProzent?: number;
  skontoTage?: number;

  // Unterschriften
  bestellerName?: string;
  bestellerDatum?: string;
  genehmigungName?: string;
  genehmigungDatum?: string;
  praesidentinName?: string;
  praesidentinDatum?: string;

  // Administrative Felder
  ustId?: string;
  inventarisierung?: boolean;
  quellensteuer?: boolean;
  auslandSoftware?: boolean;
  kuenstlersozialkasse?: boolean;
  vergabevermerk?: string;
  bieterverfahren?: string;
  inventarisierungDetails?: string;
  quellensteuerDetails?: string;
  auslandSoftwareDetails?: string;
  kuenstlersozialkasseDetails?: string;

  // Bestellkopf
  orderNumber: string;
  orderDate: string;

  // New fields
  kostentraeger?: string;
  ausgabeartAZA?: string;
  mittelBetrag?: number;
  unternehmerischVerwendung?: string;
  unternehmerischProzent?: number;
  vergabeBetrag?: number;
}

interface OrderFormProps {
  defaultValues?: Partial<OrderFormData>;
}

export const OrderForm = ({ defaultValues }: OrderFormProps = {}) => {
  const [items, setItems] = useState<OrderItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }
  ]);

  const { orderNumber, setOrderNumber } = useOrderNumberContext();

  // Hilfsfunktion zur Initialen-Generierung
  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 3);
  }

  // Automatische Auftragsnummer generieren
  function generateOrderNumber(contactPerson: string) {
    const year = new Date().getFullYear().toString().slice(-2);
    const department = "THA";
    const initials = getInitials(contactPerson || "");
    const sequence = "001"; // Optional: Sequenz könnte aus LocalStorage oder Backend kommen
    return `${year}-${department}-${initials}-${sequence}`;
  }

  // Hilfsfunktion für 25-stellige eindeutige Nummer
  function generateUniqueOrderNumber() {
    const year = new Date().getFullYear().toString().slice(-2);
    const department = "THA";
    const unique = uuidv4().replace(/-/g, '').slice(0, 20);
    return `${year}${department}${unique}`.slice(0, 25);
  }

  const { register, handleSubmit, watch, setValue, formState: { errors }, control } = useForm<OrderFormData>({
    defaultValues: {
      // Pre-filled TH Aschaffenberg information
      deliveryBuilding: "C2-318",
      contactPerson: "Prof. Biedermann",
      contactPhone: "+49 (0)6021-4206-926",
      contactFax: "+49 (0)6021-4206-600",
      chapter: "1234",
      titleTG: "987654",
      costCenter: "6606105",
      shippingCost: 0,
      taxRate: 19,
      items: items,
      orderNumber: "",
      orderDate: new Date().toISOString().split('T')[0],
      kostentraeger: "",
      ausgabeartAZA: "",
      mittelBetrag: 0,
      unternehmerischVerwendung: "",
      unternehmerischProzent: 0,
      vergabeBetrag: 0,
      ...defaultValues // überschreibt ggf. mitgegebenes
    }
  });

  // Automatisch beim Laden und bei Änderung der Kontaktperson setzen
  useEffect(() => {
    const contactPerson = watch("contactPerson") || "";
    const autoOrderNumber = generateOrderNumber(contactPerson);
    setValue("orderNumber", autoOrderNumber);
  }, [watch("contactPerson"), setValue]);

  const addItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const shippingCost = watch('shippingCost') ?? 0;
  const taxRateRaw = watch('taxRate');
  const taxRate = typeof taxRateRaw === 'number' && !isNaN(taxRateRaw) ? taxRateRaw : 19;
  const taxAmount = taxRate > 0 ? (subtotal + shippingCost) * (taxRate / 100) : 0;
  const totalAmount = subtotal + shippingCost + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  const onSubmit = (data: OrderFormData) => {
    const orderData = {
      ...data,
      items,
      subtotal,
      shippingCost,
      taxAmount,
      totalAmount,
      timestamp: new Date().toISOString()
    };
    
    console.log("Order submitted:", orderData);
    toast.success("Bestellung erfolgreich erstellt! Formular kann jetzt gedruckt werden.");
  };

  // Skonto-Berechnung
  const skontoProzent = watch('skontoProzent') ?? 0;
  const skontoTage = watch('skontoTage') ?? 0;
  const skontoBetrag = skontoProzent > 0 && skontoTage > 0 ? totalAmount * (skontoProzent / 100) : 0;
  const totalAfterSkonto = totalAmount - skontoBetrag;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Kopfbereich: Auftragsnummer und Datum */}
      <Card>
        <CardHeader>
          <CardTitle>Bestellkopf</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="orderNumber">Auftragsnummer</Label>
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
          <div className="space-y-2">
            <Label htmlFor="orderDate">Datum</Label>
            <Input
              id="orderDate"
              type="date"
              {...register("orderDate", { required: "Datum ist erforderlich" })}
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Supplier Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-university" />
            Lieferanteninformation
          </CardTitle>
          <CardDescription>
            Tragen Sie hier die Daten des Lieferanten ein
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="supplierName">Firma</Label>
            <Input
              id="supplierName"
              {...register("supplierName", { required: "Firmenname ist erforderlich" })}
              placeholder="z.B. Völkner Elektronik"
            />
            {errors.supplierName && (
              <p className="text-sm text-destructive">{errors.supplierName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supplierFax">Faxnummer</Label>
            <Input
              id="supplierFax"
              {...register("supplierFax")}
              placeholder="z.B. +49 (0)351-25555-555"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="supplierAddress">Adresse</Label>
            <Textarea
              id="supplierAddress"
              {...register("supplierAddress", { required: "Adresse ist erforderlich" })}
              placeholder="Straße, PLZ Ort"
              rows={3}
            />
            {errors.supplierAddress && (
              <p className="text-sm text-destructive">{errors.supplierAddress.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-university" />
            Lieferinformation
          </CardTitle>
          <CardDescription>
            Standard-Lieferadresse TH Aschaffenberg
          </CardDescription>
        </CardHeader>
        {/* Bildschirm-Ansicht */}
        <CardContent className="print:hidden">
          <div className="bg-university-light p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2">Lieferadresse:</h4>
            <p className="text-sm">
              TH Aschaffenburg<br />
              Würzburger Str. 45<br />
              63743 Aschaffenberg
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryBuilding">Gebäude/Raum</Label>
              <Input id="deliveryBuilding" {...register("deliveryBuilding")} placeholder="z.B. C2-318" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Kontaktperson</Label>
              <Input id="contactPerson" {...register("contactPerson")} placeholder="z.B. Prof. Biedermann" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telefon</Label>
              <Input id="contactPhone" {...register("contactPhone")} placeholder="+49 (0)6021-4206-926" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactFax">Fax</Label>
              <Input id="contactFax" {...register("contactFax")} placeholder="+49 (0)6021-4206-600" />
            </div>
          </div>
        </CardContent>
        {/* Druck-Ansicht */}
        <div className="hidden print:block print:space-y-2 print:mt-2">
          <div className="print:mb-2">
            <strong>Lieferadresse:</strong><br />
            TH Aschaffenburg<br />
            Würzburger Str. 45<br />
            63743 Aschaffenberg
          </div>
          <table className="print-no-border" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'inherit' }}>
            <thead>
              <tr>
                <th>Gebäude/Raum</th>
                <th>Kontaktperson</th>
                <th>Telefon</th>
                <th>Fax</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{watch('deliveryBuilding')}</td>
                <td>{watch('contactPerson')}</td>
                <td>{watch('contactPhone')}</td>
                <td>{watch('contactFax')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bestellpositionen */}
      <Card className="print-keep-together">
        <CardHeader>
          <CardTitle>Bestellpositionen</CardTitle>
          <CardDescription>
            Tragen Sie hier die zu bestellenden Artikel ein
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg">
                <div className="md:col-span-2">
                  <Label htmlFor={`item-${item.id}-artikelnummer`}>Artikelnummer</Label>
                  <Input
                    id={`item-${item.id}-artikelnummer`}
                    value={item.artikelnummer || ""}
                    onChange={(e) => updateItem(item.id, 'artikelnummer', e.target.value)}
                    placeholder="Artikelnummer"
                  />
                </div>
                <div className="md:col-span-5">
                  <Label htmlFor={`item-${item.id}-description`}>Beschreibung</Label>
                  <Input
                    id={`item-${item.id}-description`}
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Artikelbeschreibung"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`item-${item.id}-quantity`}>Menge</Label>
                  <Input
                    id={`item-${item.id}-quantity`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`item-${item.id}-unitPrice`}>Einzelpreis (€)</Label>
                  <Input
                    id={`item-${item.id}-unitPrice`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Gesamtpreis</Label>
                  <div className="flex items-center h-10 px-3 rounded-md border bg-muted">
                    <span className="font-medium">{item.total.toFixed(2)} €</span>
                  </div>
                </div>
                <div className="md:col-span-1 flex items-end justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Position hinzufügen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mittelbereitstellung */}
      <Card className="print-keep-together">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-university" />
            Mittelbereitstellung
          </CardTitle>
          <CardDescription>
            Haushaltsstellen, Kostenarten und unternehmerische Verwendung
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
          {/* Kapitel */}
          <div className="space-y-2">
            <Label htmlFor="chapter" className="flex items-center gap-1">
              Kapitel
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer"><Info className="w-4 h-4 text-muted-foreground" /></span>
                  </TooltipTrigger>
                  <TooltipContent>Sofern kein Sonderkapitel betroffen ist (z.B. Erstausstattung 1549) immer 1532 angeben.</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input id="chapter" {...register("chapter", { required: "Kapitel ist erforderlich" })} placeholder="z.B. 1532" />
          </div>
          {/* Titel/TG */}
          <div className="space-y-2">
            <Label htmlFor="titleTG" className="flex items-center gap-1">
              Titel/TG
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer"><Info className="w-4 h-4 text-muted-foreground" /></span>
                  </TooltipTrigger>
                  <TooltipContent>Unbedingt Titel (genaue Bezeichnung) angeben.</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input id="titleTG" {...register("titleTG", { required: "Titel/TG ist erforderlich" })} placeholder="z.B. 987654" />
          </div>
          {/* Kostenstelle */}
          <div className="space-y-2">
            <Label htmlFor="costCenter" className="flex items-center gap-1">
              Kostenstelle
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer"><Info className="w-4 h-4 text-muted-foreground" /></span>
                  </TooltipTrigger>
                  <TooltipContent>Kostenstelle angeben (bei Drittmitteln anstelle der Kostenstelle den Kostenträger angeben).</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select onValueChange={(value) => setValue("costCenter", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Kostenstelle auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6606105">6606105 - Labor für nutzeradaptive Systeminteraktion</SelectItem>
                <SelectItem value="6606200">6606200 - IT-Abteilung</SelectItem>
                <SelectItem value="6606300">6606300 - Verwaltung</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Kostenträger */}
          <div className="space-y-2">
            <Label htmlFor="kostentraeger" className="flex items-center gap-1">
              Kostenträger
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer"><Info className="w-4 h-4 text-muted-foreground" /></span>
                  </TooltipTrigger>
                  <TooltipContent>Bei Drittmitteln anstelle der Kostenstelle den Kostenträger angeben.</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Controller
              name="kostentraeger"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kostenträger auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KT001">KT001 - Forschungsprojekt A</SelectItem>
                    <SelectItem value="KT002">KT002 - Forschungsprojekt B</SelectItem>
                    <SelectItem value="KT003">KT003 - Drittmittelprojekt C</SelectItem>
                    <SelectItem value="KT004">KT004 - Kooperationsprojekt D</SelectItem>
                    <SelectItem value="KT005">KT005 - Stipendienprogramm</SelectItem>
                    <SelectItem value="KT006">KT006 - Weiterbildungsprojekt</SelectItem>
                    <SelectItem value="KT007">KT007 - Internationale Kooperation</SelectItem>
                    <SelectItem value="KT008">KT008 - Transferprojekt</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {/* Ausgabeart "AZA" */}
          <div className="space-y-2">
            <Label htmlFor="ausgabeartAZA" className="flex items-center gap-1">
              Ausgabeart "AZA"
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer"><Info className="w-4 h-4 text-muted-foreground" /></span>
                  </TooltipTrigger>
                  <TooltipContent>Ausgabeart (betrifft Drittmittel).</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input id="ausgabeartAZA" {...register("ausgabeartAZA")} placeholder="AZA" />
          </div>
          {/* Kostenart */}
          <div className="space-y-2">
            <Label htmlFor="costType" className="flex items-center gap-1">
              Kostenart
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer"><Info className="w-4 h-4 text-muted-foreground" /></span>
                  </TooltipTrigger>
                  <TooltipContent>Kostenart laut Tabelle auswählen.</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Controller
              name="costType"
              control={control}
              rules={{ required: "Kostenart ist erforderlich" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kostenart auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60100">60100 - Geschäftsbedarf</SelectItem>
                    <SelectItem value="60110">60110 - Papier</SelectItem>
                    <SelectItem value="60111">60111 - Visitenkarten</SelectItem>
                    <SelectItem value="60112">60112 - Vordrucke, Formulare, Ausweise</SelectItem>
                    <SelectItem value="60113">60113 - Bürobedarf und Lehr- und Unterrichtsmaterial</SelectItem>
                    <SelectItem value="62003">62003 - Elektro- und Elektronikmaterial</SelectItem>
                    <SelectItem value="62004">62004 - Gase</SelectItem>
                    <SelectItem value="62005">62005 - Chemikalien</SelectItem>
                    <SelectItem value="62011">62011 - Laborutensilien</SelectItem>
                    <SelectItem value="62017">62017 - Schutzmaßnahmen Labor</SelectItem>
                    <SelectItem value="62018">62018 - Roh-, Hilfs-, Betriebsstoffe Labor</SelectItem>
                    <SelectItem value="62030">62030 - Hardware bis 800 Euro netto</SelectItem>
                    <SelectItem value="62301">62301 - Software und Lizenzen bis 800 Euro netto</SelectItem>
                    <SelectItem value="62302">62302 - Mobilär bis 800 Euro netto</SelectItem>
                    <SelectItem value="62311">62311 - Maschinen, Geräte und Fuhrpark bis 800 Euro netto</SelectItem>
                    <SelectItem value="62312">62312 - Medien, Video, Fotografie bis 800 Euro netto</SelectItem>
                    <SelectItem value="62515">62515 - Dienst- und Schutzkleidung bis 800 Euro netto</SelectItem>
                    <SelectItem value="62540">62540 - Reparaturen Geräte, Maschinen, EDV und Fuhrpark</SelectItem>
                    <SelectItem value="63010">63010 - Strom</SelectItem>
                    <SelectItem value="63020">63020 - (Heiz-)Gas</SelectItem>
                    <SelectItem value="63030">63030 - Wasser, Abwasser, Niederschlagswasser</SelectItem>
                    <SelectItem value="63040">63040 - Reinigungs-, Hygienearktikel</SelectItem>
                    <SelectItem value="64390">64390 - Verbrauchsmaterial, Rohstoffe, Fremdbauteile bezüglich Gebäudemanagement</SelectItem>
                    <SelectItem value="64930">64930 - Sonstige Nebenkosten der Datenverarbeitung</SelectItem>
                    <SelectItem value="66901">66901 - Behindertenwerkstatt-Aufträge</SelectItem>
                    <SelectItem value="68030">68030 - Allgemeiner Hochschulsport</SelectItem>
                    <SelectItem value="68058">68058 - Medizinische Hilfsmittel</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {/* Betrag in € */}
          <div className="space-y-2">
            <Label htmlFor="mittelBetrag" className="flex items-center gap-1">
              Betrag in €
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer"><Info className="w-4 h-4 text-muted-foreground" /></span>
                  </TooltipTrigger>
                  <TooltipContent>Bei aufgeteilten Rechnungen bitte hier den jeweiligen Betrag angeben, der aus diesem Topf gezahlt werden soll.</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input id="mittelBetrag" type="number" step="0.01" {...register("mittelBetrag", { valueAsNumber: true })} placeholder="0.00" />
          </div>
        </CardContent>
        {/* Kompakte Tabelle nur im Druck */}
        <div className="hidden print:block">
          <table className="print-no-border" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'inherit' }}>
            <tbody>
              <tr>
                <td><strong>Kapitel</strong></td>
                <td>{watch('chapter')}</td>
                <td><strong>Kostenstelle</strong></td>
                <td>{watch('costCenter')}</td>
              </tr>
              <tr>
                <td><strong>Titel/TG</strong></td>
                <td>{watch('titleTG')}</td>
                <td><strong>Kostenträger</strong></td>
                <td>{watch('kostentraeger')}</td>
              </tr>
              <tr>
                <td><strong>Ausgabeart</strong></td>
                <td>{watch('ausgabeartAZA')}</td>
                <td><strong>Kostenart</strong></td>
                <td>{watch('costType')}</td>
              </tr>
              <tr>
                <td><strong>Betrag in €</strong></td>
                <td>{watch('mittelBetrag')}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Unternehmerische Verwendung */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Unternehmerische Verwendung
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer"><Info className="w-4 h-4 text-muted-foreground" /></span>
                </TooltipTrigger>
                <TooltipContent>Die unternehmerische (wirtschaftliche) Verwendung ist zu dokumentieren und ggf. der Finanzverwaltung nachzuweisen.</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 print:hidden">
          <div className="flex items-center gap-4">
            <Label>Wird die Leistung für den unternehmerischen (wirtschaftlichen) Bereich verwendet?</Label>
            <label><input type="radio" value="ja" {...register("unternehmerischVerwendung")} /> Ja</label>
            <label><input type="radio" value="nein" {...register("unternehmerischVerwendung")} /> Nein</label>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="unternehmerischProzent">Prozentualer Anteil der unternehmerischen (wirtschaftlichen) Verwendung:</Label>
            <Input id="unternehmerischProzent" type="number" min="0" max="100" step="1" {...register("unternehmerischProzent", { valueAsNumber: true })} placeholder="0" className="w-20" />
            <span>%</span>
          </div>
        </CardContent>
        {/* Druck-Ansicht */}
        <div className="hidden print:flex print:gap-x-8 print:items-baseline print:ml-1 print:mb-1">
          <div><strong>Unternehmerische Verwendung:</strong> {watch('unternehmerischVerwendung') === 'ja' ? 'Ja' : 'Nein'}</div>
          <div><strong>Prozentualer Anteil:</strong> {watch('unternehmerischProzent') ?? 0} %</div>
        </div>
      </Card>

      {/* Skonto-Eingabe */}
      <Card className="print-keep-together">
        <CardHeader>
          <CardTitle>Skonto</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
          <div className="space-y-2">
            <Label htmlFor="skontoProzent">Skonto (%)</Label>
            <Input
              id="skontoProzent"
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...register("skontoProzent", { valueAsNumber: true })}
              placeholder="z.B. 2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skontoTage">Skonto bei Zahlung innerhalb von ... Tagen</Label>
            <Input
              id="skontoTage"
              type="number"
              min="0"
              {...register("skontoTage", { valueAsNumber: true })}
              placeholder="z.B. 10"
            />
          </div>
        </CardContent>
        {/* Druck-Ansicht */}
        <div className="hidden print:block print:mt-2">
          <table className="print-no-border" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'inherit' }}>
            <thead>
              <tr>
                <th>Skonto (%)</th>
                <th>Skonto bei Zahlung innerhalb von ... Tagen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{watch('skontoProzent')}</td>
                <td>{watch('skontoTage')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bestellsumme */}
      <Card>
        <CardHeader>
          <CardTitle>Bestellsumme</CardTitle>
        </CardHeader>
        <CardContent className="print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="shippingCost">Versandkosten (€)</Label>
              <Input
                id="shippingCost"
                type="number"
                step="0.01"
                min="0"
                {...register("shippingCost", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">MwSt. (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...register("taxRate", { valueAsNumber: true, onChange: (e) => setValue('taxRate', parseFloat(e.target.value) || 0) })}
              />
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Zwischensumme:</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>Versandkosten:</span>
              <span>{shippingCost.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>MwSt. ({taxRate}%):</span>
              <span>{taxAmount.toFixed(2)} €</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Gesamtsumme:</span>
              <span className="text-university">{totalAmount.toFixed(2)} €</span>
            </div>
            {/* Skonto-Betrag anzeigen, falls Skonto eingegeben */}
            {skontoProzent > 0 && skontoTage > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Skonto ({skontoProzent}% bei Zahlung innerhalb {skontoTage} Tagen):</span>
                <span>-{skontoBetrag.toFixed(2)} €</span>
              </div>
            )}
            {/* Gesamtsumme nach Skonto */}
            {skontoBetrag > 0 && (
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Gesamtsumme nach Skonto:</span>
                <span>{totalAfterSkonto.toFixed(2)} €</span>
              </div>
            )}
          </div>
        </CardContent>
        {/* Druck-Ansicht */}
        <div className="hidden print:block print:mt-2">
          <table className="print-no-border" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'inherit' }}>
            <thead>
              <tr>
                <th>Versandkosten (€)</th>
                <th>MwSt. (%)</th>
                <th>Zwischensumme</th>
                <th>Versandkosten</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{watch('shippingCost')}</td>
                <td>{watch('taxRate')}</td>
                <td>{subtotal.toFixed(2)} €</td>
                <td>{shippingCost.toFixed(2)} €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Anmerkungen</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            {...register("notes")}
            placeholder="Zusätzliche Anmerkungen zur Bestellung..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Administrative Angaben */}
      <Card>
        <CardHeader>
          <CardTitle>Administrative Angaben</CardTitle>
          <CardDescription>
            Zusätzliche Angaben für Verwaltung und Rechtssicherheit
          </CardDescription>
        </CardHeader>
        {/* Bildschirm-Ansicht */}
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
          <div className="space-y-2">
            <Label htmlFor="ustId">USt-ID der Hochschule</Label>
            <Input
              id="ustId"
              value="DE217803882"
              readOnly
              className="bg-muted cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leitwegId">Leitweg-ID der Hochschule</Label>
            <Input
              id="leitwegId"
              value="09-1532019-80"
              readOnly
              className="bg-muted cursor-not-allowed"
            />
          </div>
          {/* Inventarisierung */}
          <div className="space-y-2">
            <Controller
              name="inventarisierung"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch id="inventarisierung" checked={!!field.value} onCheckedChange={field.onChange} className="print:hidden" />
                  <Label htmlFor="inventarisierung">Inventarisierung erforderlich</Label>
                  <span className="hidden print:inline ml-2">{field.value ? 'Ja' : 'Nein'}</span>
                </div>
              )}
            />
            <p className="text-xs text-muted-foreground ml-8">Hinweis: Inventarisierungspflicht ab 800 Euro netto</p>
            {watch("inventarisierung") && (
              <div className="mt-2">
                <Label htmlFor="inventarisierungDetails">Inventarnummer / Begründung</Label>
                <Input id="inventarisierungDetails" {...register("inventarisierungDetails")} placeholder="z.B. Inventarnummer oder Begründung" />
              </div>
            )}
          </div>
          {/* Quellensteuer */}
          <div className="space-y-2">
            <Controller
              name="quellensteuer"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch id="quellensteuer" checked={!!field.value} onCheckedChange={field.onChange} className="print:hidden" />
                  <Label htmlFor="quellensteuer">Quellensteuerpflichtig</Label>
                  <span className="hidden print:inline ml-2">{field.value ? 'Ja' : 'Nein'}</span>
                </div>
              )}
            />
            {watch("quellensteuer") && (
              <div className="mt-2">
                <Label htmlFor="quellensteuerDetails">Steuerliche Angaben / Begründung</Label>
                <Textarea id="quellensteuerDetails" {...register("quellensteuerDetails")} placeholder="z.B. Begründung, Steuersatz, Gesetzesgrundlage" rows={2} />
              </div>
            )}
          </div>
          {/* Ausländische Software/Datenbanken */}
          <div className="space-y-2">
            <Controller
              name="auslandSoftware"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch id="auslandSoftware" checked={!!field.value} onCheckedChange={field.onChange} className="print:hidden" />
                  <Label htmlFor="auslandSoftware">Ausländische Software/Datenbanken</Label>
                  <span className="hidden print:inline ml-2">{field.value ? 'Ja' : 'Nein'}</span>
                </div>
              )}
            />
            {watch("auslandSoftware") && (
              <div className="mt-2">
                <Label htmlFor="auslandSoftwareDetails">Details zur Software/Datenbank</Label>
                <Textarea id="auslandSoftwareDetails" {...register("auslandSoftwareDetails")} placeholder="z.B. Name, Lizenz, Herkunftsland, Zweck" rows={2} />
              </div>
            )}
          </div>
          {/* Künstlersozialkasse */}
          <div className="space-y-2">
            <Controller
              name="kuenstlersozialkasse"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch id="kuenstlersozialkasse" checked={!!field.value} onCheckedChange={field.onChange} className="print:hidden" />
                  <Label htmlFor="kuenstlersozialkasse">Künstlersozialkasse relevant</Label>
                  <span className="hidden print:inline ml-2">{field.value ? 'Ja' : 'Nein'}</span>
                </div>
              )}
            />
            {watch("kuenstlersozialkasse") && (
              <div className="mt-2">
                <Label htmlFor="kuenstlersozialkasseDetails">KSK-relevante Angaben / Begründung</Label>
                <Textarea id="kuenstlersozialkasseDetails" {...register("kuenstlersozialkasseDetails")} placeholder="z.B. Begründung, KSK-Nummer, Nachweise" rows={2} />
              </div>
            )}
          </div>
        </CardContent>
        {/* Druck-Ansicht */}
        <div className="hidden print:block print:space-y-2">
          <div className="print:flex print:gap-x-8 print:items-baseline">
            <div className="print:w-1/2"><strong>USt-ID der Hochschule</strong>: DE217803882</div>
            <div className="print:w-1/2"><strong>Leitweg-ID der Hochschule</strong>: 09-1532019-80</div>
          </div>
          <div className="print:flex print:gap-x-8 print:items-baseline print:mt-2">
            <div className="print:w-1/4"><strong>Inventarisierung erforderlich</strong>: {watch('inventarisierung') ? 'Ja' : 'Nein'}</div>
            <div className="print:w-1/4"><strong>Quellensteuerpflichtig</strong>: {watch('quellensteuer') ? 'Ja' : 'Nein'}</div>
            <div className="print:w-1/4"><strong>Ausländische Software/Datenbanken</strong>: {watch('auslandSoftware') ? 'Ja' : 'Nein'}</div>
            <div className="print:w-1/4"><strong>Künstlersozialkasse relevant</strong>: {watch('kuenstlersozialkasse') ? 'Ja' : 'Nein'}</div>
          </div>
          {watch('inventarisierung') && (
            <div className="print:mt-1"><strong>Inventarnummer / Begründung</strong>: {watch('inventarisierungDetails')}</div>
          )}
          {watch('quellensteuer') && (
            <div className="print:mt-1"><strong>Steuerliche Angaben / Begründung</strong>: {watch('quellensteuerDetails')}</div>
          )}
          {watch('auslandSoftware') && (
            <div className="print:mt-1"><strong>Details zur Software/Datenbank</strong>: {watch('auslandSoftwareDetails')}</div>
          )}
          {watch('kuenstlersozialkasse') && (
            <div className="print:mt-1"><strong>KSK-relevante Angaben / Begründung</strong>: {watch('kuenstlersozialkasseDetails')}</div>
          )}
        </div>
      </Card>

      {/* Vergabevermerk */}
      <Card className="print-keep-together">
        <CardHeader>
          <CardTitle>Vergabevermerk (ab 5.000 €)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs text-muted-foreground mb-1">Gemäß VgV i.d.F.v. 18.12.24 i.V.m. §14 UVgO wurde nach einer Markterkundung das folgende verbindliche Direktangebot eingeholt:</div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="vergabeBetrag">Betrag:</Label>
            <Input id="vergabeBetrag" type="number" step="0.01" {...register("vergabeBetrag", { valueAsNumber: true })} placeholder="0.00" className="w-32" />
            <span>€</span>
          </div>
          <Textarea id="vergabevermerk" {...register("vergabevermerk")} placeholder="Begründung, Markterkundung, Direktangebot..." rows={2} />
          <div className="text-xs text-muted-foreground mt-1">Für Forschungsprojekte ab 1.000 € und für Vergaben ab 50.000 € bitte einen ausführlichen, separaten Vergabevermerk erstellen.</div>
        </CardContent>
      </Card>

      {/* Erklärung für ein objektives Bieterverfahren */}
      <Card>
        <CardHeader>
          <CardTitle>Erklärung für ein objektives Bieterverfahren</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea id="bieterverfahren" {...register("bieterverfahren")} placeholder="Persönliche und/oder wirtschaftliche Verpflichtungen mit dem Anbieter/der Firma?" rows={2} />
          <div className="text-xs text-muted-foreground">Bitte geben Sie an, ob persönliche und/oder wirtschaftliche Verpflichtungen mit dem Anbieter/der Firma bestehen.</div>
        </CardContent>
      </Card>

      {/* Unterschriften */}
      <Card className="print-keep-together">
        <CardHeader>
          <CardTitle>Unterschriften</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="signature-block">
              <Label>Unterschrift Bestellung</Label>
              <div className="signature-line" />
            </div>
            <div className="signature-block">
              <Label>Unterschrift Labor-/Referatsleitung</Label>
              <div className="signature-line" />
            </div>
            <div className="signature-block">
              <Label>Unterschrift Leitung Dekanat/ZE/Drittmittelprojekt</Label>
              <div className="signature-line" />
            </div>
            <div className="signature-block flex flex-col items-center mt-8">
              <Label className="mb-2">Die Präsidentin</Label>
              <div className="signature-line w-48" />
              <span className="text-sm text-muted-foreground mt-1">Prof. Dr. Beck-Meuth</span>
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
        <Button type="submit" className="bg-gradient-primary">
          Bestellung erstellen
        </Button>
      </div>
    </form>
  );
};