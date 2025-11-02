#  Open Stage Control Templates for Gig Performer

This repository contains a complete collection of **templates, modules, and scripts** to control **Gig Performer** using **[Open Stage Control](https://openstagecontrol.ammd.net/)**.  
The goal is to provide a ready-to-use toolkit for building **custom OSC control surfaces** for live and studio use.

Mode for display with resolution 1000 x 760

<img width="993" height="749" alt="image" src="https://github.com/user-attachments/assets/fcfa1a5e-217b-4836-9e60-5da358dcc0e2" />

Mode for display with resolution 1000 x 580 (5-inch display)

<img width="989" height="571" alt="image" src="https://github.com/user-attachments/assets/f2d7d2e5-256c-4764-bf83-839984c44a83" />

Mode for display with resolution 420 x 580 (portrait display)

<img width="414" height="948" alt="image" src="https://github.com/user-attachments/assets/cd7b00e0-e276-4a2b-b946-5a104c9843e8" />


---

## What is Open Stage Control

**Open Stage Control** is an open-source application (based on Electron and Node.js) that allows you to create **interactive graphic interfaces** to control audio and video software via **OSC** or **MIDI**.  
It is fully customizable and works on:
- **Windows**
- **macOS**
- **Linux**
- **Raspberry Pi**

You can run Open Stage Control as a **server** on your computer and connect from any **browser** (PC, tablet, or smartphone) as a **client**.

---

## Project structure

The repository structure is as follows:


```
/assets
├── /themes
│ Contains custom themes and graphic resources for the interface

/config
├── Example .json configuration files
│ Useful for setting up OSC ports, themes, and custom modules.

/GPscript
├── Helper scripts for Gig Performer.
│ - One of the scripts automatically generates the list of Rackspaces,
│ which can be sent as a list to an Open Stage Control widget.
| Keboard.gpscript (for the MIDI Keyboard object)
| RackPartList.gpscript (helper functions)

/GPTemplate
├── Base interface template for testing communication with Gig Performer.
| Control_Board.gig

/Modules
├── setlist.js
│ JavaScript module containing all the functions needed to:
│ - Manage setlists and dynamic lists
│ - Detect client IP and port
│ - Synchronize OSC data between server and client
│ - Manage rack, song, and setlist buffers

/Release
├── Template_full_r1
│ Full interface for 10"+ screens (desktop or tablet)
├── Template_tiny_r1
│ Optimized version for 5" displays (e.g., Raspberry Pi)
├── Template_Portrait_r1
│ Vertical layout for smartphones
```



---

## Installation

1. **Download Open Stage Control**  
   👉 [https://github.com/jean-emmanuel/open-stage-control/releases](https://github.com/jean-emmanuel/open-stage-control/releases)

2. **Start the server** on Windows, macOS, or Linux:
   - Double-click the executable file  
   - Or via terminal:
     ```bash
     open-stage-control
     ```

<img width="937" height="309" alt="image" src="https://github.com/user-attachments/assets/0991c3a9-42c6-484a-ada1-dd851cd8418a" />

3. **Configuration**
   -
   - **send**  IP:PORT  server parameters  
     In this example, the server runs on the same computer as Gig Performer, so the loopback address is used.
     
   - **port** Open Stage Control server port (Gig Performer listening port)  
   - **theme** Paths to the custom theme files.
     
     Add the following styles to use the custom template:
     ```
     C:\Users\domep\Documents\GitHub\GP-OpenStageControl\assets\themes\my_theme.css 
     C:\Users\domep\Documents\GitHub\GP-OpenStageControl\assets\themes\ace-tm.css
     C:\Users\domep\Documents\GitHub\GP-OpenStageControl\assets\themes\ace_editor.css
     C:\Users\domep\Documents\GitHub\GP-OpenStageControl\assets\themes\widget.css
     ```

**Note:**  
The files must be listed on a single line, separated by spaces.

4. **Load a template**:
   - Go to **Load**
   - Select one of the `.json` files from `/Release`
   - (Optional) Specify a `.json` configuration file from `/config`

5. **Custom module**
   - Go to **Load**
   - Select the `setlist.js` file located in `/Modules`
     
6. **osc-port**
   - Receiving port for OSC messages (Remote Client Port)
   
7. **Start the server**  
   - Use the **arrow button** in the top-left corner or press **F5**
   - Additional startup options are available under the **Launcher** menu

	<img width="940" height="311" alt="image" src="https://github.com/user-attachments/assets/b82a5bac-ba18-4987-a661-25355cbb752b" />

9. **Display mode**
   - The **no-gui** option enables the internal Open Stage Control browser
   - To display in fullscreen, enable **fullscreen**

You can view the template from an external browser using:  
http://127.0.0.1:8080/

<img width="940" height="587" alt="image" src="https://github.com/user-attachments/assets/eaf91998-299f-4500-b48b-5ae47ef9c249" />

For more details and configuration options, you can access the local documentation:

<img width="940" height="311" alt="image" src="https://github.com/user-attachments/assets/5d32e140-f959-474c-9aeb-ecb36fb445e6" />

Official project resources:  
**Open Stage Control**  
<img width="50" height="50" alt="image" src="https://github.com/user-attachments/assets/af59a415-e761-4f08-ab43-068c2fd5a88b" />

Libre and modular OSC / MIDI controller  

Website: https://openstagecontrol.ammd.net/  
Forum: https://openstagecontrol.discourse.group/  
IRC: Libera.chat #openstagecontrol  

---

## Usage with Gig Performer

The templates are designed to interact with Gig Performer through **bidirectional OSC messages**.  
- You can send commands to Gig Performer to switch **rackspaces, variations, or song parts**.  
- You can receive status data (active rack, parameters, names, etc.) and display it on the interface.

**OSC configuration**  
Example setup:

<img width="669" height="245" alt="image" src="https://github.com/user-attachments/assets/674b2291-a22d-482f-82d3-99c0b41a167a" />

> The resource \GPTemplate\Control_Board.gig includes a complete test file.

The scripts in `/GPscript` must be imported into Gig Performer as **Helper Functions** to automatically generate the dynamic list of rackspaces used in Open Stage Control list widgets.
 
 
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

## Custom module (`setlist.js`)

The `/Modules/setlist.js` file contains all the necessary functions to:
- Manage **Setlist, Song, and Rackspace** buffers
- Synchronize OSC data between server and client
- Detect connected clients' **IP** and **port**
- Handle incoming commands and update interface widgets
- Generate album cover images using the artist name  
  > Example: [COVER] Request: https://itunes.apple.com/search?term=Kiss&entity=musicTrack&limit=1

The module must be loaded through the **Custom Module** section in Open Stage Control’s settings.

---

## Themes and interfaces

The CSS files included in `/assets/themes` allow full customization of the templates’ visual appearance, adapting them to display type and environment (dark/light mode, touch devices, etc.).

---

## Requirements

- **Gig Performer 4 or later**  
- **Open Stage Control 1.29+**  
- **Local network connection** (Wi-Fi or Ethernet)  
- (Optional) **Node.js** if you want to launch O.S.C. from the terminal

---

## Tips

- Use the `Template_full_r1` for full setup and testing.  
- The `Template_tiny_r1` is ideal for 5” screens like Raspberry Pi displays.  
- The `Template_Portrait_r1` is optimized for smartphones — great for quick remote control.

---

## 📜 License

This project is distributed under the **MIT License**.  
You are free to use, modify, and redistribute the files, provided you credit the original source.

---
