# Wiederverwendbare Header-Komponente

## Übersicht
Die Header-Navigation wurde in eine wiederverwendbare Komponente ausgelagert, sodass Änderungen am Header automatisch auf allen Projektseiten (P1-P8) übernommen werden.

## Dateistruktur
```
src/
├── components/
│   └── project-header.html      # Wiederverwendbare Header-Komponente
├── scripts/
│   ├── header-loader.js         # Lädt den Header dynamisch
│   └── mobile-nav.js            # Mobile Navigation (exportiert initMobileNav)
```

## Integration in bestehende Seiten

### Schritt 1: HTML anpassen

**Alte Struktur ersetzen:**
```html
<body>
    <header class="main-header">
        <nav>
            <a href="../../index.html" class="logo">ANIKA WARNCKE</a>
            <button class="mobile-nav-toggle" ...>...</button>
            <ul>...</ul>
        </nav>
    </header>
```

**Neue Struktur:**
```html
<body>
    <!-- Header wird dynamisch geladen -->
    <div id="header-placeholder"></div>
```

### Schritt 2: Scripts einbinden

**Vor dem schließenden `</body>` Tag:**
```html
    <script src="../scripts/mobile-nav.js"></script>
    <script src="../scripts/header-loader.js"></script>
</body>
```

### Schritt 3: CSS beibehalten

Die bestehenden Header-Styles müssen in jeder Seite erhalten bleiben:
- `.main-header` Styles
- `.main-header.scrolled` Styles  
- Hero-spezifische Farbanpassungen

## Vorteile

✅ **Zentrale Wartung**: Änderungen an Navigation/Hamburger-Menü nur noch an einer Stelle
✅ **Konsistenz**: Alle Projektseiten haben identische Navigation
✅ **Einfache Updates**: Neue Menüpunkte oder Links nur einmal hinzufügen

## Anmerkungen

- Der Header wird beim Laden der Seite per `fetch()` eingebunden
- Mobile Navigation wird automatisch nach dem Laden initialisiert
- Header Scroll-Behavior (transparent → white) funktioniert wie gewohnt
- Funktioniert ohne Server-Konfiguration

## Nächste Schritte

1. **P1-P8 aktualisieren**: Header-HTML durch `<div id="header-placeholder"></div>` ersetzen
2. **Scripts einbinden**: `header-loader.js` auf allen Seiten einbinden
3. **Testen**: Mobile Navigation auf allen Seiten prüfen
