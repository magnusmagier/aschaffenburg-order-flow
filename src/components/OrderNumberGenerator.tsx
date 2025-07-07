import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, RefreshCw, Hash, Calendar, Building, User } from "lucide-react";
import { toast } from "sonner";

interface OrderNumberComponents {
  year: string;
  department: string;
  userInitials: string;
  sequence: string;
}

export const OrderNumberGenerator = () => {
  const [components, setComponents] = useState<OrderNumberComponents>({
    year: new Date().getFullYear().toString().slice(-2),
    department: "THA",
    userInitials: "",
    sequence: "001"
  });
  
  const [generatedNumber, setGeneratedNumber] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateOrderNumber = () => {
    setIsGenerating(true);
    
    // Simulate generation process
    setTimeout(() => {
      const orderNumber = `${components.year}-${components.department}-${components.userInitials}-${components.sequence}`;
      setGeneratedNumber(orderNumber);
      setIsGenerating(false);
      toast.success("Auftragsnummer erfolgreich generiert!");
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedNumber);
    toast.success("Auftragsnummer in Zwischenablage kopiert!");
  };

  const resetGenerator = () => {
    setComponents({
      year: new Date().getFullYear().toString().slice(-2),
      department: "THA",
      userInitials: "",
      sequence: "001"
    });
    setGeneratedNumber("");
  };

  const updateComponent = (key: keyof OrderNumberComponents, value: string) => {
    setComponents(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const incrementSequence = () => {
    const currentSequence = parseInt(components.sequence) || 0;
    const newSequence = (currentSequence + 1).toString().padStart(3, '0');
    updateComponent('sequence', newSequence);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Generator Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-university" />
            Auftragsnummer-Generator
          </CardTitle>
          <CardDescription>
            Generieren Sie eine eindeutige Auftragsnummer nach dem Schema: 
            <Badge variant="outline" className="ml-2">Jahr-Abteilung-Initialen-Sequenz</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Components */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Jahr
              </Label>
              <Input
                id="year"
                value={components.year}
                onChange={(e) => updateComponent('year', e.target.value.slice(0, 2))}
                placeholder="24"
                maxLength={2}
                className="text-center font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Abteilung
              </Label>
              <Input
                id="department"
                value={components.department}
                onChange={(e) => updateComponent('department', e.target.value.toUpperCase().slice(0, 5))}
                placeholder="THA"
                maxLength={5}
                className="text-center font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userInitials" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Initialen
              </Label>
              <Input
                id="userInitials"
                value={components.userInitials}
                onChange={(e) => updateComponent('userInitials', e.target.value.toUpperCase().slice(0, 3))}
                placeholder="ABC"
                maxLength={3}
                className="text-center font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sequence" className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Sequenz
              </Label>
              <div className="flex gap-1">
                <Input
                  id="sequence"
                  value={components.sequence}
                  onChange={(e) => updateComponent('sequence', e.target.value.padStart(3, '0').slice(0, 3))}
                  placeholder="001"
                  maxLength={3}
                  className="text-center font-mono"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={incrementSequence}
                  className="px-2"
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Vorschau:</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={resetGenerator}
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Zurücksetzen
                </Button>
              </div>
            </div>
            <div className="text-2xl font-mono text-center py-4 bg-background rounded border-2 border-dashed border-university/30">
              {components.year || "??"}
              <span className="text-muted-foreground">-</span>
              {components.department || "???"}
              <span className="text-muted-foreground">-</span>
              {components.userInitials || "???"}
              <span className="text-muted-foreground">-</span>
              {components.sequence || "???"}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button
              onClick={generateOrderNumber}
              disabled={!components.userInitials || isGenerating}
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
                  Auftragsnummer generieren
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Result */}
      {generatedNumber && (
        <Card className="border-success/20 bg-success/5">
          <CardHeader>
            <CardTitle className="text-success">Generierte Auftragsnummer</CardTitle>
            <CardDescription>
              Ihre eindeutige Auftragsnummer wurde erfolgreich erstellt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                <div className="text-3xl font-mono font-bold text-university">
                  {generatedNumber}
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Kopieren
                </Button>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-muted-foreground">Jahr</div>
                  <div className="font-mono">{components.year}</div>
                </div>
                <div>
                  <div className="font-semibold text-muted-foreground">Abteilung</div>
                  <div className="font-mono">{components.department}</div>
                </div>
                <div>
                  <div className="font-semibold text-muted-foreground">Initialen</div>
                  <div className="font-mono">{components.userInitials}</div>
                </div>
                <div>
                  <div className="font-semibold text-muted-foreground">Sequenz</div>
                  <div className="font-mono">{components.sequence}</div>
                </div>
              </div>
              
              <div className="p-3 bg-university-light rounded-lg">
                <p className="text-sm text-university">
                  <strong>Hinweis:</strong> Übertragen Sie diese Auftragsnummer in Ihr Bestellformular. 
                  Die Nummer ist eindeutig und kann zur Nachverfolgung verwendet werden.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Verwendungshinweise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <Badge variant="outline" className="min-w-[3rem] justify-center">1</Badge>
              <div>
                <p className="font-medium">Initialen eingeben</p>
                <p className="text-muted-foreground">Geben Sie Ihre Initialen ein (z.B. "ABC" für Anna Berta Cäsar)</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Badge variant="outline" className="min-w-[3rem] justify-center">2</Badge>
              <div>
                <p className="font-medium">Auftragsnummer generieren</p>
                <p className="text-muted-foreground">Klicken Sie auf "Generieren", um eine eindeutige Nummer zu erstellen</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Badge variant="outline" className="min-w-[3rem] justify-center">3</Badge>
              <div>
                <p className="font-medium">In Bestellformular übertragen</p>
                <p className="text-muted-foreground">Kopieren Sie die Nummer und fügen Sie sie in Ihr Excel-Bestellformular ein</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Badge variant="outline" className="min-w-[3rem] justify-center">4</Badge>
              <div>
                <p className="font-medium">Sequenz erhöhen</p>
                <p className="text-muted-foreground">Für weitere Bestellungen erhöhen Sie die Sequenznummer mit dem "+" Button</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};