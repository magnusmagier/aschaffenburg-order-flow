import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, RefreshCw, Hash, Calendar, Building, User } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { useOrderNumberContext } from "./OrderNumberContext";

interface OrderNumberComponents {
  year: string;
  department: string;
  userInitials: string;
  sequence: string;
}

export const OrderNumberGenerator = () => {
  const { orderNumber, setOrderNumber } = useOrderNumberContext();
  const [isGenerating, setIsGenerating] = useState(false);

  function generateUniqueOrderNumber() {
    const year = new Date().getFullYear().toString().slice(-2);
    const department = "THA";
    const unique = uuidv4().replace(/-/g, '').slice(0, 20);
    return `${year}${department}${unique}`.slice(0, 25);
  }

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newNumber = generateUniqueOrderNumber();
      setOrderNumber(newNumber);
      setIsGenerating(false);
      toast.success("Eindeutige Auftragsnummer generiert!");
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-university" />
            Auftragsnummer-Generator
          </CardTitle>
          <CardDescription>
            Generieren Sie eine eindeutige 25-stellige Auftragsnummer für Ihre Bestellung.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-primary"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generiere...
                </>
              ) : (
                <>
                  <Hash className="w-4 h-4 mr-2" />
                  Eindeutige Auftragsnummer generieren
                </>
              )}
            </Button>
          </div>
          {orderNumber && (
            <div className="flex flex-col items-center mt-6">
              <div className="text-2xl font-mono font-bold text-university p-4 bg-background rounded border-2 border-dashed border-university/30">
                {orderNumber}
              </div>
              <Button
                onClick={() => {navigator.clipboard.writeText(orderNumber); toast.success("Auftragsnummer in Zwischenablage kopiert!");}}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                <Copy className="w-4 h-4 mr-2" />
                Kopieren
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};