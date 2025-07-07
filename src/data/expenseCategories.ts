export interface ExpenseCategory {
  code: string;
  name: string;
  description: string;
  examples?: string[];
}

export const expenseCategories: ExpenseCategory[] = [
  {
    code: "60100",
    name: "Geschäftsbedarf",
    description: "Toner, Druckeretiketten, Druckerpatronen, Injekt Folien, Fotopapier für den Drucker, Plotter-Papier, USB-Stick, CDs, CD-Boxen, Akkus für Kameras"
  },
  {
    code: "60110",
    name: "Papier",
    description: "Papierbedarf für das Büro"
  },
  {
    code: "60111",
    name: "Visitenkarten",
    description: "Visitenkarten"
  },
  {
    code: "60112",
    name: "Vordrucke, Formulare, Ausweise",
    description: "Urkunden, Zeugnisse, Dienstausweise"
  },
  {
    code: "60113",
    name: "Bürobedarf und Lehr- und Unterrichtsmaterial",
    description: "Stifte, Kreide, Kreidehalter, Folienmarkplätze, Tafel, Moderationsmaterialien, Flipchart, Vorlesungsunterlagen, Skripte, Laserpointer, Zirkel, Leim, Taschenrechner, Lineal, Geodreieck, Magnete, Schablonen, Löcher, Tacker, Kopierfolien, Ordner, Mappen, Stempel, Kleinmaschinen, Namensschilder, Pinnwand, Versandtaschen, Trennstreifen"
  },
  {
    code: "62003",
    name: "Elektro- und Elektronikmaterial",
    description: "Dioden, Kabel, Leitungen, Stromumwandler, Elektronikmaterial, Elektrozubehör, Geräteanstallationsmaterial, Kondensatoren, Batterien, Leuchtdioden, Widerstände, Steckdosenleisten, Steckzubehör, Adapterkabel, Widerstände, Kabel, Elektronik, Steuerergeräte für Motoren, Leiterplatten"
  },
  {
    code: "62004",
    name: "Gase",
    description: "Büssner Stickstoff, Wasserstoff, Plastische Gase (Heizöl), Druckbehälter"
  },
  {
    code: "62005",
    name: "Chemikalien",
    description: ""
  },
  {
    code: "62011",
    name: "Laborutensilien",
    description: "Pipetten, Schalen, Flaschen, Messzylinder, Petrischalen, Reaktionsgefäße, Universalbehälter, Zellkulturfläschen"
  },
  {
    code: "62017",
    name: "Schutzmaßnahmen Labor",
    description: "Strahenschutz, Messgeräte, Schutzkleidung, Schutzbrille, Sicherheitswerkzeuge, Hinweisschilder"
  },
  {
    code: "62018",
    name: "Roh-, Hilfs-, Betriebsstoffe Labor",
    description: "Latexhandschuhe, Schleifpapier, Löskolben, Lambourtratschen, Heißklebepistolen, Klebstoffe, Nasenschutzpaper"
  },
  {
    code: "62200",
    name: "Hardware bis 800 Euro netto",
    description: "Copy Station, Festplatten, Scanner, M-Karte, USB-Lautsprecher, Tastatur, Switches, Mouse, Box, Tonabnahme, PC-Lautsprecher, Bürstenmaus, Netzwerk"
  },
  {
    code: "62301",
    name: "Software und Lizenzen bis 800 Euro netto",
    description: ""
  },
  {
    code: "62310",
    name: "Mobiliar bis 800 Euro netto",
    description: "Laptoptasche, Lampe, Container, Schrankschienen, Bürodrehstuhl, Freischwinger, Stehtisch, Abfallbehälter, Deckenventilationen, Bürostuhl, Tafel, Whiteboard"
  },
  {
    code: "62311",
    name: "Maschinen, Geräte und Fuhrpark bis 800 Euro netto",
    description: "Beschaffung von Geräten bzw. deren Instandhaltung bis 800 € netto sind. Beispiele: Gebrauchtkostenabrechnung bis 800 € netto sind, sonst 91001 - Staubsauger, Pumpe, Gasflaschenregler, Warneanlage, Antriebe, Kompressor, Netzgeräte, Diktiergerät"
  },
  {
    code: "62312",
    name: "Medien, Video, Fotografie bis 800 Euro netto",
    description: "Temperaturmessgerät, Schaumstoffzange, Hubwagen, Stuhlwagen, Fahrrad-Bügelpacker, Tischwagen, Wasserspender, Kamera, Bildbearbeitung, TV, DVD-Player, Beamer, Antennen, Foto-Kabel, Monitor, Internet, Roll Up Display, Sicherheitsschuhe"
  },
  {
    code: "62315",
    name: "Dienst- und Schutzkleidung bis 800 Euro netto",
    description: "Fotografen, Mikrofonhalterung, Projektor, Projektionsfläche, Internetkameras, Roll Up Display, Sicherheitsschuhe"
  },
  {
    code: "62400",
    name: "Reparaturen Geräte, Maschinen, EDV und Fuhrpark",
    description: "Laborgeräte, Fax, Drucker, Rechner, Kamera, Videogeräte"
  },
  {
    code: "63000",
    name: "Strom",
    description: "Abschlagszahlung BHW, Sammlzuschläge"
  },
  {
    code: "63002",
    name: "(Heiz-)Gas",
    description: "Erdgas, Heizgas, Gas für Labore in 62001 oder 62018"
  },
  {
    code: "63010",
    name: "Wasser, Abwasser, Niederschlagswasser",
    description: ""
  },
  {
    code: "63107",
    name: "Reinigungs-, Hygieneartikel",
    description: "Seife, Reinigungsmittel, Toilettenhygienemittel, Spülmaschinentabs, salz, Sprit, Benzin für Rasenmäher, Streugut, Leuchtmittel, Wischgut, Reinigungsgeräte, Besen, Werkzeug, Sauggut, Blumenerle, Dünger"
  },
  {
    code: "63209",
    name: "Verbrauchsmaterial, Rohstoffe, Fremdbauteile bezüglich Gebäudemanagement",
    description: ""
  },
  {
    code: "63590",
    name: "Sonstige Nebenkosten der Datenverarbeitung",
    description: "Domainpräsentgeld, Einrichtungsengeld (für Internetseite)"
  },
  {
    code: "66501",
    name: "Behindertenweiterförderung",
    description: "Arbeitsleistung"
  },
  {
    code: "68030",
    name: "Allgemeiner Hochschulsport",
    description: "Hallenmiete, Pacht, Ausstattung, Übungsleiter, Geräte"
  },
  {
    code: "68058",
    name: "Medizinische Hilfsmittel",
    description: "Erste Hilfekoffer, Verbandkästen, erste Hilfe Handschuhe, Pflaster, Bildschirmbrille"
  }
];