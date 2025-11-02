// setlist.js
const fs = nativeRequire('fs');
const path = nativeRequire('path');

module.exports = {
  init: function () {
    // Buffers used to accumulate names coming from GP before flushing to widgets
    this.setlistBuffer = [];
    this.setSongBuffer = [];
    this.setRackBuffer = [];

    // Build a path relative to the module folder to read the app config
    const configPath = path.join(__dirname, '..', 'config', 'config.config');
    console.log("[INIT] Config file path:", configPath);

    try {
      const raw = fs.readFileSync(configPath, 'utf8');
      const json = JSON.parse(raw);
      this.GP_TARGET = (json.send && json.send[0]) || '127.0.0.1:11000';
      console.log('[INIT] GP_TARGET set to:', this.GP_TARGET);
    } catch (err) {
      console.error('[INIT] Failed to read config, using default target:', err);
      this.GP_TARGET = '127.0.0.1:11000';
    }
  },

  oscInFilter: function (data) {
    var { address, args, host, port } = data;

    // Helper: extract value whether args[i] is {type, value} or a plain value
    function valOf(a) {
      if (a === undefined) return undefined;
      if (typeof a === 'object' && a !== null && 'value' in a) return a.value;
      return a;
    }

    // --- COVER LOOKUP (iTunes) ---------------------------------------------
    if (address === '/cover') {
      console.log("[COVER] Incoming request");
      const https = nativeRequire('https');
      const queryRaw = valOf(args[0]) || '';
      const query = encodeURIComponent(queryRaw);

      const fallback = "img/gig.jpeg"; // local fallback image

      if (!queryRaw) {
        console.log("[COVER] Empty query, using local fallback.");
        receive('/cover/url', fallback);
        return;
      }

      const url = `https://itunes.apple.com/search?term=${query}&entity=musicTrack&limit=1`;
      console.log("[COVER] Request:", url);

      https.get(url, (resp) => {
        let raw = '';
        resp.on('data', chunk => raw += chunk);
        resp.on('end', () => {
          try {
            const data = JSON.parse(raw);
            if (data.results && data.results.length > 0) {
              const img = data.results[0].artworkUrl100.replace('100x100bb', '300x300bb');
              console.log(`[COVER] Found for "${queryRaw}": ${img}`);
              // Widget should bind value to OSC{/cover/url}
              receive('/cover/url', img);
            } else {
              console.log(`[COVER] No results for "${queryRaw}", using local fallback.`);
              receive('/cover/url', fallback);
            }
          } catch (err) {
            console.log('[COVER] JSON parse error, using local fallback:', err.message);
            receive('/cover/url', fallback);
          }
        });
      }).on('error', err => {
        console.log('[COVER] HTTP error, using local fallback:', err.message);
        receive('/cover/url', fallback);
      });

      // Stop further processing for this message
      return;
    }

    // --- DYNAMICALLY SET GP TARGET -----------------------------------------
    if (address === '/setTarget') {
      let ip, p;

      // Two args => IP and PORT
      if (args.length >= 2) {
        ip = valOf(args[0]);
        p = valOf(args[1]);
        this.GP_TARGET = `${ip}:${p}`;
      }
      // One arg => already "IP:PORT"
      else {
        this.GP_TARGET = valOf(args[0]);
      }

      console.log("[TARGET] Updated to:", this.GP_TARGET);
      return { address, args, host, port };
    }

    // --- SETLIST BUFFERING --------------------------------------------------
    if (address === '/SetListsStart') {
      this.setlistBuffer = [];
      return { address, args, host, port };
    }
		
	if (address === '/SetListName') {
      var idx = valOf(args[0]);
      var name = valOf(args[1]);
      if (!this.setlistBuffer) this.setlistBuffer = [];
      this.setlistBuffer[idx] = name;
      console.log("[SETLIST] Name:", name);
      return { address, args, host, port };
    }
	
	if (address === '/SetListsEnd') {
      // Normalize buffer: replace undefined slots with empty strings
      var values = (this.setlistBuffer || []).map(function (x) { return x === undefined ? "" : x; });

      // Push options into a dropdown (widget should bind options to OSC{/setlists/options})
      receive('/setlists/options', ...values);

      // Optionally set the initially selected value to the first item
      if (values.length > 0) receive('/setlists/value', values[0]);

      console.log("[SETLIST] Updated:", values);
      return { address, args, host, port };
    }

    // --- SONGLIST BUFFERING -------------------------------------------------
    if (address === '/SongListStart') {
      this.setSongBuffer = [];
      return { address, args, host, port };
    }

    if (address === '/SongName') {
      var idx = valOf(args[0]);
      var name = valOf(args[1]);
      if (!this.setSongBuffer) this.setSongBuffer = [];
      this.setSongBuffer[idx] = name;
      console.log("[SONG] Name:", name);
      return { address, args, host, port };
    }

    if (address === '/SongListEnd') {
      var values = (this.setSongBuffer || []).map(function (x) { return x === undefined ? "" : x; });

      // Push options into a dropdown (widget should bind options to OSC{/songlist/options})
	  receive('/songlist/options', ...values);
      receive('/songlist/count', 1);

      if (values.length > 0) receive('/songlist/value', values[0]);

      console.log("[SONGLIST] Updated:", values);
      return { address, args, host, port };
    }

    // --- RACKLIST BUFFERING -------------------------------------------------
    if (address === '/RackspaceListStart') {
      this.setRackBuffer = [];
      return { address, args, host, port };
    }

    if (address === '/Rackspace') {
      var idx = valOf(args[0]);
      var name = valOf(args[1]);
      if (!this.setRackBuffer) this.setRackBuffer = [];
      this.setRackBuffer[idx] = name;
      console.log("[RACK] Name:", name);
      return { address, args, host, port };
    }

    if (address === '/RackspaceListEnd') {
      var values = (this.setRackBuffer || []).map(function (x) { return x === undefined ? "" : x; });

      // Push options into a dropdown (widget should bind options to OSC{/racklist/options})
	  receive('/racklist/options', ...values);
      receive('/racklist/count', 1);

      // receive('/RackList/value', values[0]);
      if (values.length > 0) receive('/racklist/value', values[0]);

      console.log("[RACKLIST] Updated:", values);
      return { address, args, host, port };
    }

    // --- TOP MENU BUTTONS (RACK / SETLIST) ---------------------------------
    if (address === '/GlobalRackspace/btnRack/SetValue') {
      const index = valOf(args[0]);

      if (!this.GP_TARGET) {
        console.warn("[TARGET] Not set, using fallback 127.0.0.1:11000");
        this.GP_TARGET = "127.0.0.1:11000";
      }

      switch (index) {
        case 0: // Setlist View
          send(this.GP_TARGET, '/GigPerformer/GetSetLists');
          send(this.GP_TARGET, '/GigPerformer/SelectSetList', 0);
          send(this.GP_TARGET, '/SetList/GetSongList');
          send(this.GP_TARGET, '/Actions/SetlistView');
          send(this.GP_TARGET, '/menu', 0);
          break;

        case 1: // Panel View + lists
          send(this.GP_TARGET, '/Actions/PanelView');
          send(this.GP_TARGET, '/GigPerformer/ListAllRackspaces');
          send(this.GP_TARGET, '/GigPerformer/ListAllVariations');
          send(this.GP_TARGET, '/menu', 1);
          break;

        default:
          console.log("[BTN] Unrecognized index:", index);
      }

      return { address, args, host, port };
    }
    // Default: let the message continue
    return { address, args, host, port };
  }
};
