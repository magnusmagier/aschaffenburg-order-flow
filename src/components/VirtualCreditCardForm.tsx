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
}

export const VirtualCreditCardForm = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<VirtualCreditCardFormData>({
    defaultValues: {
      organizationUnit: "Technische Hochschule Aschaffenburg",
      costCenter: "6606105",
      deliveryCountry: "deutschland",
      requestDate: new Date().toISOString().split('T')[0],
      euRegulationAgreement: false,
      orderingAgreement: false
    }
  });

  const euRegulationAgreement = watch('euRegulationAgreement');
  const orderingAgreement = watch('orderingAgreement');
  const estimatedAmount = watch('estimatedAmount') || 0;

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
      {/* Header Information */}
      <Card className="bg-university-light border-university/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-university">
            <CreditCard className="w-5 h-5" />
            Bestellformular "Virtuelle Kreditkarte" für Online-Bestellungen
          </CardTitle>
          <CardDescription>
            Höchstwert: 5000,- EUR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 p-4 bg-warning/10 rounded-lg border border-warning/20">
            <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Wichtige Hinweise:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Die Bestellung ist EU-Ausland oder Drittland ist unwiderrufbar einer Gst (15-16 Nr 1 VAT Nr 27/2018/29 zumindest).</li>
                <li>• Das Formular muss gedruckt und unterschrieben werden.</li>
                <li>• Die Bestellung ist EU-bestellung nur gegen eine gültige Rechnung möglich.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-university" />
            Organisationseinheit / Kostenstelle
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="organizationUnit">Organisationseinheit</Label>
            <Input
              id="organizationUnit"
              {...register("organizationUnit", { required: "Organisationseinheit ist erforderlich" })}
              placeholder="Technische Hochschule Aschaffenburg"
            />
            {errors.organizationUnit && (
              <p className="text-sm text-destructive">{errors.organizationUnit.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="costCenter">Kostenstelle</Label>
            <Input
              id="costCenter"
              {...register("costCenter", { required: "Kostenstelle ist erforderlich" })}
              placeholder="6606105"
            />
            {errors.costCenter && (
              <p className="text-sm text-destructive">{errors.costCenter.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Service Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="w-5 h-5 text-university" />
            Leistungsbeschreibung der Leistung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serviceDescription">Leistung</Label>
            <Textarea
              id="serviceDescription"
              {...register("serviceDescription", { required: "Leistungsbeschreibung ist erforderlich" })}
              placeholder="Beschreibung der zu bestellenden Leistung/Artikel..."
              rows={3}
            />
            {errors.serviceDescription && (
              <p className="text-sm text-destructive">{errors.serviceDescription.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Lieferant</Label>
              <Input
                id="supplier"
                {...register("supplier", { required: "Lieferant ist erforderlich" })}
                placeholder="Name des Lieferanten"
              />
              {errors.supplier && (
                <p className="text-sm text-destructive">{errors.supplier.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedAmount">Geschätzter Auftragswert (EUR)</Label>
              <Input
                id="estimatedAmount"
                type="number"
                step="0.01"
                max="5000"
                {...register("estimatedAmount", { 
                  required: "Auftragswert ist erforderlich",
                  max: { value: 5000, message: "Maximaler Betrag: 5000 EUR" },
                  min: { value: 0.01, message: "Betrag muss größer als 0 sein" }
                })}
                placeholder="0.00"
              />
              {errors.estimatedAmount && (
                <p className="text-sm text-destructive">{errors.estimatedAmount.message}</p>
              )}
              {estimatedAmount > 5000 && (
                <p className="text-sm text-warning">⚠️ Betrag überschreitet das Limit von 5000 EUR</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Country */}
      <Card>
        <CardHeader>
          <CardTitle>Lieferung</CardTitle>
          <CardDescription>
            Die Bestellung erfolgt in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="deutschland"
                  value="deutschland"
                  {...register("deliveryCountry", { required: true })}
                  className="w-4 h-4"
                />
                <Label htmlFor="deutschland">Deutschland</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="eu-land"
                  value="eu-land"
                  {...register("deliveryCountry", { required: true })}
                  className="w-4 h-4"
                />
                <Label htmlFor="eu-land">EU-Land</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="drittland"
                  value="drittland"
                  {...register("deliveryCountry", { required: true })}
                  className="w-4 h-4"
                />
                <Label htmlFor="drittland">Drittland</Label>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Wichtiger Hinweis:</strong> Bitte haben Sie den Antragsteller bei der Rechnungsstellung an die Technische Hochschule Aschaffenburg, Würzburger Straße 45, 63743 Aschaffenburg, zu richten ist.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Agreements */}
      <Card>
        <CardHeader>
          <CardTitle>Rechtliche Vereinbarungen</CardTitle>
          <CardDescription>
            Erforderliche Bestätigungen für die Bearbeitung
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="euRegulationAgreement"
                checked={euRegulationAgreement}
                onCheckedChange={(checked) => setValue('euRegulationAgreement', !!checked)}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label htmlFor="euRegulationAgreement" className="text-sm font-medium leading-relaxed">
                  Die Bestellung von EU-Ausland-oder Drittland ist einwandfrei einer GzT (15-16 Nr 1 VAT Nr 27/2018/29 zumindest). 
                  Anderweitig ist das auch in EUR (Nr 86/78/75/2 der Bestellung beigefügt).
                </Label>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="orderingAgreement"
                checked={orderingAgreement}
                onCheckedChange={(checked) => setValue('orderingAgreement', !!checked)}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label htmlFor="orderingAgreement" className="text-sm font-medium leading-relaxed">
                  Die Bestellung ist festgelegt.
                </Label>
              </div>
            </div>
          </div>
          
          {(!euRegulationAgreement || !orderingAgreement) && (
            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-sm text-destructive">
                ⚠️ Beide Vereinbarungen müssen bestätigt werden, um den Antrag einzureichen.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Zusätzliche Informationen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requestDate">Antragsdatum</Label>
            <Input
              id="requestDate"
              type="date"
              {...register("requestDate", { required: "Antragsdatum ist erforderlich" })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Anmerkung zur Abrechnung/Beantakt</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Zusätzliche Anmerkungen..."
              rows={3}
            />
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Bestellformular „Virtuelle Kreditkarte" für Online-Bestellungen</p>
          </div>
        </CardContent>
      </Card>

      {/* Signature Section */}
      <Card>
        <CardHeader>
          <CardTitle>Unterschrift</CardTitle>
          <CardDescription>
            Das Formular muss ausgedruckt und unterschrieben werden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label>Unterschrift</Label>
              <div className="h-20 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Unterschrift Kostenstelle/Vorgesetzter/in</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Unterschrift Kostenstellenverantwortliche</Label>
              <div className="h-20 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Bei Auftragswert über 1.500€</span>
              </div>
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