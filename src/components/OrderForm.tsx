import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Building2, MapPin, Calculator } from "lucide-react";
import { toast } from "sonner";
import { expenseCategories } from "@/data/expenseCategories";

interface OrderItem {
  id: string;
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
}

export const OrderForm = () => {
  const [items, setItems] = useState<OrderItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }
  ]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<OrderFormData>({
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
      items: items
    }
  });

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
  const shippingCost = watch('shippingCost') || 0;
  const taxRate = watch('taxRate') || 19;
  const taxAmount = (subtotal + shippingCost) * (taxRate / 100);
  const totalAmount = subtotal + shippingCost + taxAmount;

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
        <CardContent>
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
              <Input
                id="deliveryBuilding"
                {...register("deliveryBuilding")}
                placeholder="z.B. C2-318"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Kontaktperson</Label>
              <Input
                id="contactPerson"
                {...register("contactPerson")}
                placeholder="z.B. Prof. Biedermann"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telefon</Label>
              <Input
                id="contactPhone"
                {...register("contactPhone")}
                placeholder="+49 (0)6021-4206-926"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactFax">Fax</Label>
              <Input
                id="contactFax"
                {...register("contactFax")}
                placeholder="+49 (0)6021-4206-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-university" />
            Mittelherkunft
          </CardTitle>
          <CardDescription>
            Haushaltsstellen und Kostenarten
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="chapter">Kapitel</Label>
            <Input
              id="chapter"
              {...register("chapter")}
              placeholder="z.B. 1234"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="titleTG">Titel/TG</Label>
            <Input
              id="titleTG"
              {...register("titleTG")}
              placeholder="z.B. 987654"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="costCenter">Kostenstelle</Label>
            <Input
              id="costCenter"
              {...register("costCenter")}
              placeholder="z.B. 6606105"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="costType">Kostenart</Label>
            <Select onValueChange={(value) => setValue("costType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Kostenart auswählen" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((category) => (
                  <SelectItem key={category.code} value={category.code}>
                    <div className="flex flex-col">
                      <span className="font-medium">{category.code} - {category.name}</span>
                      <span className="text-xs text-muted-foreground">{category.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
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

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Bestellsumme</CardTitle>
        </CardHeader>
        <CardContent>
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
                {...register("taxRate", { valueAsNumber: true })}
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
          </div>
        </CardContent>
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

      {/* Submit */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Entwurf speichern
        </Button>
        <Button type="submit" className="bg-gradient-primary">
          Bestellung erstellen
        </Button>
      </div>
    </form>
  );
};