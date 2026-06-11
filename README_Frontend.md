# SmartTask Frontend

Dieses Projekt ist die Angular-Frontend-Applikation für das SmartTask-System.

## Voraussetzungen

* Node.js
* npm
* Angular
* Backend SmartTask
* Keycloak Server

## Techstack

Das Frontend wurde mit Angular und TypeScript umgesetzt.

Verwendet werden unter anderem:

* Angular Standalone Components
* Angular Router
* Angular HttpClient
* OAuth2 / OIDC mit Keycloak
* Vitest für Unit Tests

## Konfiguration

Das Frontend kommuniziert mit dem Backend über REST-Schnittstellen.

Das Backend muss laufen, damit Aufgaben, Kategorien, Prioritäten und Benutzerdaten geladen werden können.

Die Authentifizierung erfolgt über Keycloak.

## Keycloak-Einstellungen

* **Keycloak Port**: 8180
* **Realmname**: myrealm
* **Issuer-URI**: http://localhost:8180/realms/myrealm

Keycloak muss vor dem Frontend gestartet werden.

Zum Starten von Keycloak:

```bash
cd Desktop\keycloak-26.6.0\keycloak-26.6.0\bin
.\kc.bat start-dev --http-port=8180
```

## Backend

Das Backend muss ebenfalls gestartet sein.

Im Projektordner:

```bash
cd backend
./mvnw.cmd spring-boot:run
```

Das Backend läuft auf Port `8081`.

## Start des Frontends

Im Projektordner ein Terminal öffnen und in den Frontend-Ordner wechseln:

```bash
cd frontend
```

Danach die Abhängigkeiten installieren, falls noch nicht vorhanden:

```bash
npm install
```

Frontend starten:

```bash
npm run start
```

Danach ist das Frontend im Browser erreichbar.

## Funktionen

Das Frontend bietet folgende Funktionen:

* Login über Keycloak
* Aufgaben anzeigen
* Aufgaben erstellen
* Aufgaben bearbeiten
* Aufgaben löschen
* Kategorien verwalten
* Prioritäten verwalten
* Benutzerprofil anzeigen
* Benutzer suchen
* Rollenbasierte Freigabe von Funktionen

## Rollen

Die Applikation verwendet Rollen aus Keycloak.

Beispiele:

* `read`
* `update`
* `admin`

Gewisse Seiten und Buttons werden nur angezeigt, wenn der Benutzer die passende Rolle besitzt.

## Tests

Die Frontend-Tests werden mit folgendem Befehl gestartet:

```bash
cd frontend
npm test
```

Getestet werden unter anderem:

* TaskService
* Laden von Aufgaben
* Erstellen von Aufgaben
* Aktualisieren von Aufgaben
* Löschen von Aufgaben
* ConfirmDialogComponent

## Hinweise

Damit das Frontend korrekt funktioniert, müssen PostgreSQL, Keycloak und das Backend laufen.

Empfohlene Startreihenfolge:

1. PostgreSQL starten
2. Keycloak starten
3. Backend starten
4. Frontend starten
