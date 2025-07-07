import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CreditCard, Hash, FileText } from "lucide-react";
import { OrderForm } from "./OrderForm";
import { VirtualCreditCardForm } from "./VirtualCreditCardForm";
import { OrderNumberGenerator } from "./OrderNumberGenerator";
import SampleOrder from "../pages/SampleOrder";

const OrderingSystem = () => {
  const [activeTab, setActiveTab] = useState("order");

  return (
    <div className="min-h-screen bg-gradient-to-br from-university-light to-background">
      <div className="container mx-auto py-8 px-4">
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
              <Card className="shadow-soft outermost">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-university" />
                    Neue Bestellung erstellen
                  </CardTitle>
                  <CardDescription>
                    {/* Text entfernt */}
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
        </div>
      </div>
    </div>
  );
};

export default OrderingSystem;