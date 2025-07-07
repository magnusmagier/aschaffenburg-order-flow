import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CreditCard, Hash, FileText } from "lucide-react";
import { OrderForm } from "./OrderForm";
import { VirtualCreditCardForm } from "./VirtualCreditCardForm";
import { OrderNumberGenerator } from "./OrderNumberGenerator";

const OrderingSystem = () => {
  const [activeTab, setActiveTab] = useState("order");

  return (
    <div className="min-h-screen bg-gradient-to-br from-university-light to-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-medium">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-university to-accent bg-clip-text text-transparent mb-2">
            TH Aschaffenberg
          </h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Digitales Bestellsystem
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vereinfachter Bestellprozess für die Technische Hochschule Aschaffenberg.
            Digitale Formulare mit automatischer Validierung und verbesserter Benutzerführung.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="order" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Bestellung
              </TabsTrigger>
              <TabsTrigger value="credit-card" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Virtuelle Kreditkarte
              </TabsTrigger>
              <TabsTrigger value="order-number" className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Auftragsnummer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="order">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-university" />
                    Neue Bestellung erstellen
                  </CardTitle>
                  <CardDescription>
                    Erstellen Sie eine neue Bestellung mit automatischer Validierung und 
                    verbesserter Benutzerführung.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credit-card">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-university" />
                    Virtuelle Kreditkarte beantragen
                  </CardTitle>
                  <CardDescription>
                    Beantragen Sie eine virtuelle Kreditkarte für Online-Bestellungen.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VirtualCreditCardForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="order-number">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-university" />
                    Auftragsnummer generieren
                  </CardTitle>
                  <CardDescription>
                    Generieren Sie eine eindeutige Auftragsnummer für Ihre Bestellung.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderNumberGenerator />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Info Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center shadow-soft">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">Digitalisiert</h3>
                <p className="text-sm text-muted-foreground">
                  Moderne Weboberfläche statt Excel-Formulare
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-soft">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Badge className="w-6 h-6 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">Validiert</h3>
                <p className="text-sm text-muted-foreground">
                  Automatische Prüfung und Fehlerreduzierung
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-soft">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-university/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-university" />
                </div>
                <h3 className="font-semibold mb-2">Kompatibel</h3>
                <p className="text-sm text-muted-foreground">
                  Weiterhin druckbar für Unterschrift
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderingSystem;