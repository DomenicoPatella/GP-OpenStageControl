#  Open Stage Control Templates for Gig Performer

Questo repository contiene una raccolta completa di **template, moduli e script** per controllare **Gig Performer** tramite **[Open Stage Control](https://openstagecontrol.ammd.net/)**.  
L’obiettivo è fornire un set di strumenti pronti per creare **superfici di controllo OSC personalizzate** per l’uso live e in studio.

---

## Cos’è Open Stage Control

**Open Stage Control** è un’applicazione open-source (basata su Electron e Node.js) che consente di creare **interfacce grafiche interattive** per controllare software audio e video tramite **OSC** o **MIDI**.  
È completamente personalizzabile e funziona su:
- **Windows**
- **macOS**
- **Linux**
- **Raspberry Pi**

Puoi eseguire Open Stage Control come **server** sul tuo computer e connetterti con qualsiasi **browser** (PC, tablet o smartphone) come **client**.

---

## Struttura del progetto

La struttura del repository è la seguente:
```
/assets
├── /themes
│ Contiene temi personalizzati e risorse grafiche per l’interfaccia 

/config
├── Esempi di file di configurazione .json
│ Utili per impostare porte OSC, temi e moduli personalizzati.



/GPscript
├── Script helper per Gig Performer.
│ - Uno degli script consente di generare automaticamente la lista dei Rackspaces,
│ da inviare come elenco al controllo lista di Open Stage Control.
| Keboard.gpscript ( Per oggetto tastiera MIDI)
| RackPartList.gpscript   ( helper functions)

/GPTemplate
├── Modello di interfaccia base per testare la comunicazione con Gig Performer.
| Control_Board.gig

/Modules
├── setlist.js
│ Modulo JavaScript con tutte le funzioni necessarie per:
│ - Gestire setlist e liste dinamiche
│ - Rilevare IP e porta del client
│ - Sincronizzare controlli e dati OSC
│ - Gestire i buffer di rack, song e setlist

/Release
├── Template_full_r1
│ Interfaccia completa per schermi da 10"+ (desktop o tablet)
├── Template_tiny_r1
│ Versione ottimizzata per display da 5" (es. Raspberry Pi)
├── Template_Portrait_r1
│ Layout verticale per smartphone

```



---

## Installazione

1. **Scarica Open Stage Control**  
   👉 [https://github.com/jean-emmanuel/open-stage-control/releases](https://github.com/jean-emmanuel/open-stage-control/releases)

2. **Avvia il server** su Windows, macOS o Linux:
   - Doppio clic sul file eseguibile  
   - Oppure via terminale:
     ```bash
     open-stage-control
     ```

<img width="937" height="309" alt="image" src="https://github.com/user-attachments/assets/0991c3a9-42c6-484a-ada1-dd851cd8418a" />

3. **Configurazione**
   -
   - **send**  IP:PORT  parametri del servere IP e PORT  , dipende dove è localizzato il server.
     In questo esempio il server è eseguito nello stesso computer dove è in esecuzione GiG performer, quindi utilizzo indirizzo Ip loopback
     
   - **port** Porta del server Open Stage Control ( GiG Performer Listenning Port) 
   - **theme** percorsi dei temi personalizzati. 
     Esempio 
     ```
     C:\Users\domep\Documents\GitHub\GP-OpenStageControl\assets\themes\my_theme.css 
     C:\Users\domep\Documents\GitHub\GP-OpenStageControl\assets\themes\ace-tm.css
     C:\Users\domep\Documents\GitHub\GP-OpenStageControl\assets\themes\ace_editor.css
     C:\Users\domep\Documents\GitHub\GP-OpenStageControl\assets\themes\widget.css     ```

**Nota**
Nel caso di più file devono essere inseriti in un unica riga con un spazion di delimitazione 

4. **Carica un template**:
   - Vai su **Load**
   - Seleziona uno dei file `.json` presenti in `/Release`
   - (Facoltativo) Specifica un file di configurazione `.json` da `/config`

5. **custom-module**
   - Vai su **Load**
   - Seleziona il file `setlist.js` presenti in `/Modules`
  
   
6. **osc-port**
   - Porta di ricezione messaggi OSC   (Remote Client Port)

7.**Avvio del server**
Per avviare il server usare il tasto freccia in alto a sinistra o premere F5
Ci sono alcune opzioni presenti nel menù per configurare l'avvio indicate nel menù Launcher
<img width="940" height="311" alt="image" src="https://github.com/user-attachments/assets/b82a5bac-ba18-4987-a661-25355cbb752b" />

8. **Modalità di visualizzazione**
Si può decidere di avviare il server senza visualizzazione 
  - impostazione **no-gui** abilita il "browser" interno di open stage
  - Visualizzare in fullscreen impostazione **fullscreen**

Si può visualzziare il template da un browser esterno con l'indirizzo
http://127.0.0.1:8080/

<img width="940" height="587" alt="image" src="https://github.com/user-attachments/assets/eaf91998-299f-4500-b48b-5ae47ef9c249" />


Per dettagli ed altri impostazioni si può accceder alla documentazione localmente 

<img width="940" height="311" alt="image" src="https://github.com/user-attachments/assets/5d32e140-f959-474c-9aeb-ecb36fb445e6" />

**Nota**
Sia nella vista configurazione e modalità 

Oppure alle risorse ufficiali del progetto
**Open Stage Control**  
<img width="50" height="50" alt="image" src="https://github.com/user-attachments/assets/af59a415-e761-4f08-ab43-068c2fd5a88b" />

Libre and modular OSC / MIDI controller  

Website: https://openstagecontrol.ammd.net/   
Forum: https://openstagecontrol.discourse.group/    
IRC: Libera.chat #openstagecontrol    

---

## Utilizzo con Gig Performer

I template sono progettati per interagire con Gig Performer attraverso **messaggi OSC bidirezionali**.  
- Puoi inviare comandi a Gig Performer per cambiare **rackspace, variazioni o song parts**.  
- Puoi ricevere dati di stato (rack attivo, parametri, nomi, ecc.) e visualizzarli sull’interfaccia.
**Configurazione OSC**
Esempio di configurazione

<img width="669" height="245" alt="image" src="https://github.com/user-attachments/assets/674b2291-a22d-482f-82d3-99c0b41a167a" />

Nella risorsa  \GPTemplate\Control_Board.gig  c'è un file completo per testare la soluzione 
  
Lo script in `/GPscript` deve essere importato in Gig Performer come **Helper Function**, per generare automaticamente liste dinamiche (ad esempio l’elenco dei Rackspaces), utilizzabili nei controlli lista di Open Stage Control.
 ```
/******************************************************
//
// Rackspace Script
//
******************************************************/


On activate
	var index,v,cnt: int
	var name,vart,part: string
	
	index= GetCurrentRackspaceIndex()
	cnt=  GetVariationCountForRackspaceAtIndex(index)
    SendOSCMessage{ /StartPart}
	For v = 0; v < cnt; v = v + 1 Do
		//statements here
		vart=  GetVariationNameForRackspaceAtIndex(index,v)
		Print("Var name " + vart)
		part="/Part" + v +"Name"
		SendOSCMessage{ part,vart}
	end 	

	
	
End

On variation ( oldVariation : integer, newVariation : integer)
   // Called when you switch to another variation
   SendOSCMessage{ /SelectVar, newVariation}
end

 
 ```


---

## Modulo personalizzato (`setlist.js`)

Il file `/Modules/setlist.js` contiene tutte le funzioni necessarie a:
- Gestire buffer di **Setlist, Song e Rackspace**
- Sincronizzare dati OSC tra server e client
- Identificare **IP** e **porta** dei client connessi
- Gestire comandi in ingresso e aggiornare i controlli dell’interfaccia

Il modulo può essere caricato tramite la sezione **Custom Module** nelle impostazioni di Open Stage Control.

---

##  Temi e interfacce

I file CSS inclusi in `/assets/themes` permettono di personalizzare completamente l’aspetto grafico dei template, adattandoli al tipo di display e all’ambiente operativo (dark/light mode, dispositivi touch, ecc.).

---

## Requisiti

- **Gig Performer 4 o successivo**  
- **Open Stage Control 1.19+**  
- **Connessione locale** (Wi-Fi o Ethernet)
- (Facoltativo) **Node.js** se si desidera avviare O.S.C. da terminale

---

## Consigli

- Usa il template `Template_full_r1` per test e setup completi.  
- Il template `Template_tiny_r1` è ideale per schermi da 5” come i display Raspberry Pi.  
- Il `Template_Portrait_r1` è ottimizzato per smartphone, utile come controllo remoto rapido.

---

## 🧑‍💻 Autore

**Domenico Patella**  
🎧 Creatore di template per performance live e sviluppatore di strumenti per Open Stage Control e Gig Performer.  
YouTube: [STRANGER MIX](https://www.youtube.com/@strangermix)

---

## 📜 Licenza

Questo progetto è distribuito sotto licenza **MIT**.  
Puoi utilizzare, modificare e ridistribuire liberamente i file citando la fonte originale.

---
