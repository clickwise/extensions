'use strict';
var copyUrlsExpert = {
	_prefService: null,
	SORT_BY_TAB_ORDER: 'default',
	SORT_BY_DOMAIN: 'domain',
	SORT_BY_TITLE: 'title',
	TBB_ACTION_ACTIVE_WIN: 'active-win',
	TBB_ACTION_ACTIVE_TAB: 'active-tab',
	TBB_ACTION_ACTIVE_TABGROUP: 'active-tabgroup',
	TBB_ACTION_ALL_WIN: 'all-win',
	TBB_ACTION_OPEN_TABS: 'open-tabs',
	LINE_FEED:'\r\n',
	FUEL_KEY_DEFUALT_PATTERN: 'extensions.copyurlsexpert.defaulttemplate',
	FUEL_KEY_ALL_PATTERNS: 'extensions.copyurlsexpert.urltemplates',
        url_arr : null,
        nov_browser:null,
        copy_browsers:null,	
        browser_num: 0,
        history_url: "test",
        current_url: "test",
        start_host: "",   
        search_pop: 1,   
        config_file:"",
        current_host_index:0,
        close_win_num:0,  
        jump_page_num:0,
	_AsynHandler: function(file, oPrefs) {
		this.file = file;
		this.oPrefs = oPrefs;
	},	
	
	handleLoad: function(evt) {
		window.removeEventListener('load', copyUrlsExpert.handleLoad);
		window.addEventListener('unload', copyUrlsExpert.handleUnload, false);
		window.setTimeout(function() { copyUrlsExpert.init(); }, 50 );
                //copyUrlsExpert.init();
                
	},

	init: function() {
		this._prefService = this._getPrefService();
		this._handleStartup();
             
                var theFile = "D:\\SmartPro\\crawljs\\dt1119_top300_youxihost.txt";
                this._read_game_host(theFile);
                this.config_file="D:\\SmartPro\\crawljs\\config_fir.txt";
                this._read_config(this.config_file);
                this._read_config(this.config_file);
                this._read_config(this.config_file);


                // alert("history_url:"+this.history_url);
                //  alert("current_url:"+this.current_url);
                // alert("search_pop:"+this.search_pop);
                // this._write_config(config_file);
                   this._cleanThisSiteCookies("");
                //  for(var ii=0;ii<this.url_arr.length;ii++)
                //  {
                     //alert("url "+ii+" is:"+this.url_arr[ii]);
                // }


		var platformStr =  Components.classes['@mozilla.org/network/protocol;1?name=http'].getService(Components.interfaces.nsIHttpProtocolHandler).oscpu.toLowerCase();


                // this._load_host_and_refresh(this.url_arr[3]);
                //  this._save_url_local(theFile);
                //this._getAllLinks(this.url_arr[3]);
                // this.current_url=this.url_arr[3];

               
                this.start_host=this.url_arr[this.current_host_index];


                //  alert(this.start_host);
                // alert("search_pos is "+this.search_pop);


                //var hasPopWin=this._hasPopWindow(this.start_host);


                // alert("hasPopWin is "+hasPopWin);
                // if(this.nov_browser!=null)
                // {
                // alert("main_window_title:"+this.nov_browser.content.document.title);
                // alert("window_title:"+window.content.document.title); 
                // }

                 //for(var ii=0;ii<this.url_arr.length;ii++)
                 //{
                  //alert(this.current_url);
                 // this._load_host_and_refresh(this.url_arr[ii]);
                 // this._write_source();                  
                // }

                if(this.current_host_index<this.url_arr.length)
                {
                 this.current_url=this.url_arr[this.current_host_index];
                // alert("current_host_index:"+this.current_host_index);
                // alert("url_arr_0:"+this.url_arr[this.current_host_index]);
                // alert("initial current url 1 :"+this.current_url);
                 this._write_config(this.config_file);
                // this._write_config(this.config_file);
                // this._write_config(this.config_file);
                // alert("initial current url :"+this.current_url);
                 this._one_search_step(); 
                }
                
                //  copyUrlsExpert.performCopyTabsUrl(false);
		if (platformStr.indexOf('win') != -1) {
		  this.LINE_FEED = '\r\n';
		}
		else if (platformStr.indexOf('mac') != -1) {
		  this.LINE_FEED = '\r';
		}
		else if (platformStr.indexOf('unix') != -1
					|| platformStr.indexOf('linux') != -1
					|| platformStr.indexOf('sun') != -1) {
		  this.LINE_FEED = '\n';
		}

		Components.utils.import('resource://copy-urls-expert/cue-classes.jsm', copyUrlsExpert);
					
		this._AsynHandler.prototype.handleFetch = function(inputStream, status) {
			if (!Components.isSuccessCode(status)) {
				// Handle error!
				alert('Copy Urls Expert: Error reading templates list file.\n.' + status); // TODO: localize it
				return;
			}

			// The file data is contained within inputStream.
			// You can read it into a string with
			var data = '';
			var target = [];
			var index;
			
			var converterStream = null;
			try {
				//data = NetUtil.readInputStreamToString(inputStream, inputStream.available());
				
				converterStream = Components.classes["@mozilla.org/intl/converter-input-stream;1"]  
								   .createInstance(Components.interfaces.nsIConverterInputStream);  
				converterStream.init(inputStream, 'UTF-8', 1024, Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);  

				var input = {};
				// read all "bytes" (not characters) into the input
				var numChars = converterStream.readString(inputStream.available(), input);  
				if (numChars != 0) /* EOF */
					data = input.value;  				
				
				index  = copyUrlsExpert._updateModel(data, target);
			}
			catch(ex) {
				Components.utils.reportError('Copy Urls Expert: ' + ex);
				alert('Copy Urls Expert: Error reading templates list file.\nRestoring to default values.'); // TODO: localize it
				target = [];
				index = copyUrlsExpert._setupDefaultModel(target);
				
				// attempt to update file
				var defaultContent = '0' + copyUrlsExpert.LINE_FEED + target.join(copyUrlsExpert.LINE_FEED);
				copyUrlsExpert._writeDataToFile(defaultContent, this.file, function(inputStream, status) {
						if (!Components.isSuccessCode(status)) {
							// Handle error!
					 alert('Copy Urls Expert: Failed to write to templates list file (default values): ' + status); // TODO: localize it
							return;
						} });
				
			}
			finally {
				if (converterStream) {
					try { converterStream.close(); }
					catch(ex) { Components.utils.reportError('Copy Urls Expert: Error while closing file - ' + ex); }
				}
			}

			Application.storage.set(copyUrlsExpert.FUEL_KEY_ALL_PATTERNS, target);
			Application.storage.set(copyUrlsExpert.FUEL_KEY_DEFUALT_PATTERN, target[index]);

			};
			
		this._AsynHandler.prototype.handleUpdate =  function(status) {  
			if (!Components.isSuccessCode(status)) {  
				// Handle error!
				alert('Copy Urls Expert: Failed to update file templates list file: ' + status);
				return;  
			}  
			
			// Data has been written to the file.
			// First update the preferences to store the path of file
			var relFile = Components.classes['@mozilla.org/pref-relativefile;1'].createInstance(Components.interfaces.nsIRelativeFilePref);  
			relFile.relativeToKey = 'ProfD'; // or any other string listed above  
			relFile.file = this.file;             // |file| is nsILocalFile  
			this.oPrefs.setComplexValue('urltemplatesfile', Components.interfaces.nsIRelativeFilePref, relFile);			  
		};
		
		var cm = document.getElementById('contentAreaContextMenu');
		if (cm != null)	{
			cm.addEventListener('popupshowing', function (evt) { copyUrlsExpert.onContentContextMenuShowing(evt); }, false);
			this._readTemplates();
		}
	},
	
	handleUnload: function(evt) {
		var cm = document.getElementById('contentAreaContextMenu');
		if (cm != null)	{
			cm.removeEventListener('popupshowing', copyUrlsExpert.onContentContextMenuShowing);
		}
		window.removeEventListener('unload', copyUrlsExpert.handleUnload);

	},

	_handleStartup: function() {
		var oldVersion = '2.2.1';
		var currVersion = '2.2.1';
		
		try {
			oldVersion = this._prefService.getCharPref('version');
		}
		catch(e) {}
		
		if (oldVersion != currVersion) {
			this._prefService.setCharPref('version', currVersion);
			try {
				setTimeout(function() { copyUrlsExpert._welcome(currVersion); },100);
			}
			catch(e) {}
		}
	},
	
	_welcome: function(version) {
		try {
			var url = 'http://www.kashiif.com/firefox-extensions/copy-urls-expert/copy-urls-expert-welcome/?v='+version;
			openUILinkIn( url, 'tab');
		} 
		catch(e) {}
	},	
	
	_getPrefService: function() {
		var prefService = null;
		try 
		{
			prefService = gPrefService;
		}
		catch(err)
		{
			// gPrefService not available in SeaMonkey
			prefService = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService);
		}
		
		prefService = prefService.getBranch('extensions.copyurlsexpert.');
		return prefService;
	},
	
	_compareEntriesByTitle: function(a, b) {
	   if (a.title.toLowerCase() < b.title.toLowerCase())
		  return -1
	   if (a.title.toLowerCase() > b.title.toLowerCase())
		  return 1
	   // a must be equal to b
	   return 0
	},

	_compareEntriesByUrl: function(a, b) {
	   if (a.url.toLowerCase() < b.url.toLowerCase())
		  return -1
	   if (a.url.toLowerCase() > b.url.toLowerCase())
		  return 1
	   // a must be equal to b
	   return 0
	},

	_UrlEntry: function (title,url,tab) {
	   this.title=title;
	   this.url=url;
	   this.tab=tab;
	},
	
	_getEntriesFromTabs: function(aBrowsers, filterHidden) {
		var title = '';
		var url = '';
		var entries = [];

		for(var i = 0; i < aBrowsers.length; i++) {
			var tabbrowser = aBrowsers[i].gBrowser;
			var tabHistory = aBrowsers[i].sessionHistory;
			
			// Check each tab of this tabbrowser instance
			var numTabs = tabbrowser.browsers.length,
				tabContainer = tabbrowser.tabContainer;
			
			for (var index = 0; index < numTabs; index++) { 
				var targetBrwsr = tabbrowser.getBrowserAtIndex(index),
					targetTab = tabContainer.getItemAtIndex(index)

				if (filterHidden && targetTab.hidden) continue;
				
				var auxTemp = this._getEntryForTab(targetBrwsr, targetTab);
				entries.push(auxTemp);
			}
		}
		
		return entries;		
	},

	_getEntryForTab: function(brwsr, tab) {
		var url = brwsr.currentURI.spec;
		
		var title = brwsr.contentTitle;
		
		if (!title && tab) {
			title = tab.label;
		}

		var auxTemp = new copyUrlsExpert._UrlEntry(title,url);
		return auxTemp;
	},
	
	/*
	Returs a list of entries objects
	@param: tagName - Name of tag to process e.g. a, img
	@param: entryExtractor - pointer to a function that accpets two arguments item and selection
	*/
	_getEntriesFromSelection: function(tagName, entryExtractor) {
		var entries = [];

		// get the content document
		var focusedWindow = document.commandDispatcher.focusedWindow;
		var focusedDoc = document.commandDispatcher.focusedWindow.document;
		
		var sel = focusedWindow.getSelection();
		var items = focusedDoc.getElementsByTagName(tagName);
		
		for (var i=0;i < items.length;i++) {
			var item = items[i];
			var entry = entryExtractor(item, sel);
			
			if (entry) {
				entries.push(entry);
			}
			else if (entries.length) {
				// selections must be continuous
				break;
			}
		}		
		return entries;		
	},
	
	getEntryFromLink: function(link, sel) {
		var entry = null;
		// skip named anchors
		if (link.href && sel.containsNode(link, true)) {
			var title = link.title;
			if (title == '')
			{
				title = link.text.trim();
			}		
			entry = new copyUrlsExpert._UrlEntry(title,link.href);
		}
		return entry;
	},
	
	getEntryFromImage: function(image, sel) {
		var entry = null;
		// skip named anchors
		if (sel.containsNode(image, true)) {
			var title = image.title;
			if (title == '')
			{
				title = image.name;
			}
			if (title == '')
			{
				title = image.alt;
			}
			
			entry = new copyUrlsExpert._UrlEntry(title,image.src);
		}
		return entry;
	},	
	
	_copyEntriesToClipBoard: function(entries,oPrefs) {

		switch(oPrefs.getCharPref('sortby')) {
			case copyUrlsExpert.SORT_BY_TITLE:
				entries.sort(copyUrlsExpert._compareEntriesByTitle);
				break;
			case copyUrlsExpert.SORT_BY_DOMAIN:
				entries.sort(copyUrlsExpert._compareEntriesByUrl);
				break;
		}
		
		var defUrlPattern = Application.storage.get(copyUrlsExpert.FUEL_KEY_DEFUALT_PATTERN, '');
		var str = copyUrlsExpert._transform(defUrlPattern, entries);

		//alert(str);
                this._save_url_local(str);
               /*
		if(str != null && str.length > 0) {
			var oClipBoard = Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper);
			oClipBoard.copyString(str);
		}
               */

	},

	_transform: function(fmtPattern, entries) {
		var returnValue = '';

		var d = new Date();
		
		var strDate = d.toLocaleString();
		var strTime = d.getTime();
		
		var pattern = fmtPattern.pattern;
		
		for(var i = 0; i < entries.length; i++) {
			var entry = entries[i];			
			var mystring = pattern.replace(/\$title/gi,entry.title);
			mystring = mystring.replace(/\$url/gi,entry.url);
			mystring = mystring.replace(/\$index/gi,i+1);
			returnValue += mystring;
		}
		
		returnValue = fmtPattern.prefix + returnValue + fmtPattern.postfix;
		
		returnValue = returnValue.replace(/\$date/gi, strDate);
		returnValue = returnValue.replace(/\$time/gi, strTime);
		returnValue = returnValue.replace(/\$n/gi, copyUrlsExpert.LINE_FEED);

		return returnValue;
	},

	_gBrowser: function() {
		var _g = null;
		if (typeof(gBrowser) == undefined) {
			// gBrowser is not available in Seamonkey
			_g = doc.getElementById('content');			
		} else {
			_g = gBrowser;
		}
		return _g;
	},

	performCopyActiveTabUrl: function() {
		var _g = this._gBrowser();

		var entries = [copyUrlsExpert._getEntryForTab(_g.selectedBrowser)];
	
		copyUrlsExpert._copyEntriesToClipBoard(entries, copyUrlsExpert._prefService);
	},

	_getBrowsers: function(onlyActiveWindow) {
		var aBrowsers = new Array();       
		
		var winMediator = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
		if (onlyActiveWindow) {
			aBrowsers.push(winMediator.getMostRecentWindow('navigator:browser'));
		}
		else {
			var browserEnumerator = winMediator.getEnumerator('navigator:browser');
			// Iterate all open windows
			while (browserEnumerator.hasMoreElements()) {
				aBrowsers.push(browserEnumerator.getNext());
			}
		}
		
		return aBrowsers;
	},
	
	performCopyTabsUrl: function(onlyActiveWindow, filterHidden) {
		var aBrowsers = copyUrlsExpert._getBrowsers(onlyActiveWindow);
		
		var entries = copyUrlsExpert._getEntriesFromTabs(aBrowsers, filterHidden);
		
		copyUrlsExpert._copyEntriesToClipBoard(entries, copyUrlsExpert._prefService);
             //   copy_browsers=new Array(aBrowsers.length); 
                this.browser_num=aBrowsers.length;                 
                for(var i=1;i<aBrowsers.length;i++)
                {
                    var one_browser=aBrowsers[i];
                  //  copy_browsers[i]=aBrowsers[i];
                   setTimeout(function() { one_browser.close(); },100);
                   var temp_cw_num=1;
                   temp_cw_num=parseInt(this.close_win_num);
                   temp_cw_num=temp_cw_num+1;

                   if(temp_cw_num<50)
                   {
                     this.close_win_num=temp_cw_num.toString();
                     this._write_config(this.config_file);
                   }
                   else
                   {
                    setTimeout(function(){                                                                       
                     var temp_index=1;
                     copyUrlsExpert._read_config(copyUrlsExpert.config_file);
                     temp_index=parseInt(copyUrlsExpert.current_host_index);
                     temp_index=temp_index+1;
                     copyUrlsExpert.current_host_index=temp_index.toString();
                     copyUrlsExpert._write_config(copyUrlsExpert.config_file);

                     var temp_num=0;
                     copyUrlsExpert.jump_page_num=temp_num.toString();
                     copyUrlsExpert._write_config(copyUrlsExpert.config_file);

                     var temp_search_pop=1;
                     copyUrlsExpert.search_pop=temp_search_pop.toString();
                     copyUrlsExpert._write_config(copyUrlsExpert.config_file);

                     var temp_ccw_num=0;
                     copyUrlsExpert.close_win_num=temp_ccw_num.toString();
                     copyUrlsExpert._write_config(copyUrlsExpert.config_file);
                     copyUrlsExpert.init();
                     },500);
                   }


                   //this.init();
                }
                
               // this._closeBrowsers();
                             
					
	},
	
	performCopySelectedUrls : function(tagName, entryExtractor) {
		var entries = copyUrlsExpert._getEntriesFromSelection(tagName, entryExtractor);
		copyUrlsExpert._copyEntriesToClipBoard(entries, copyUrlsExpert._prefService);
	},
	
	onContentContextMenuShowing: function(evt) {
		if (evt.target.id == 'contentAreaContextMenu')
		{
			var f = copyUrlsExpert._isEmptySelection();

			var mnuItm = document.getElementById('copyurlsexpert-contextmenu-mainmenu');
			mnuItm.collapsed = f;
		}
	},
	
	_isEmptySelection: function () {
		// Check if there is some text selected

		var focusedWindow = document.commandDispatcher.focusedWindow;
		var sel = focusedWindow.getSelection.call(focusedWindow);		
		return sel.isCollapsed;
	},

	handleToolbarButtonClick: function(evt) {
	
		switch (evt.target.id) {
			case 'copyurlsexpert-toolbar-btnmain':
				switch(copyUrlsExpert._prefService.getCharPref('toolbaraction')) {
					case copyUrlsExpert.TBB_ACTION_ACTIVE_WIN:
						copyUrlsExpert.performCopyTabsUrl(true);
						break;
					case copyUrlsExpert.TBB_ACTION_ACTIVE_TABGROUP:
						copyUrlsExpert.performCopyTabsUrl(true, true);
						break;
					case copyUrlsExpert.TBB_ACTION_ACTIVE_TAB:
						copyUrlsExpert.performCopyActiveTabUrl();
						break;
					case copyUrlsExpert.TBB_ACTION_ALL_WIN:
						copyUrlsExpert.performCopyTabsUrl(false);
						break;
					case copyUrlsExpert.TBB_ACTION_OPEN_TABS:
						document.getElementById('copyurlsexpert-command-opentabs').doCommand();
						break;
				}
				break;
			case 'copyurlsexpert-toolbar-btnactivewin':
				copyUrlsExpert.performCopyTabsUrl(true);
				break;
			case 'copyurlsexpert-toolbar-btnactivetabgroup':
				copyUrlsExpert.performCopyTabsUrl(true, true);
				break;
			case 'copyurlsexpert-toolbar-btnactivetab':
				copyUrlsExpert.performCopyActiveTabUrl();
				break;
			case 'copyurlsexpert-toolbar-btnallwin':
				copyUrlsExpert.performCopyTabsUrl(false);
				break;
			case 'copyurlsexpert-toolbar-btnoptions':
				copyUrlsExpert.showOptionsWindow();
				break;
		}
	},
	
	showOptionsWindow: function() {
		//window.open('chrome://copy-urls-expert/content/dialogs/options.xul', 'copyUrlsExpertOptionsWindow', 'addressbar=no, modal');

         var features = "chrome,titlebar,toolbar,centerscreen";
         try {
           var instantApply = Services.prefs.getBoolPref('browser.preferences.instantApply');
           features += instantApply ? ",dialog=no" : ",modal";
         } catch (e) {
           features += ",modal";
         }
         openDialog('chrome://copy-urls-expert/content/dialogs/options.xul', '', features);
	},


	_getClipboardText: function() {
		var clip = Components.classes['@mozilla.org/widget/clipboard;1'].getService(Components.interfaces.nsIClipboard);  
		if (!clip) return null;  
		  
		var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
		if (!trans) return null;  
		
		var source = window;
		
		// Ref: https://developer.mozilla.org/en-US/docs/Using_the_Clipboard
		if ('init' in trans) {
			// When passed a Window object, find a suitable provacy context for it.
			if (source instanceof Ci.nsIDOMWindow)
				// Note: in Gecko versions >16, you can import the PrivateBrowsingUtils.jsm module
				// and use PrivateBrowsingUtils.privacyContextFromWindow(sourceWindow) instead
				source = source.QueryInterface(Ci.nsIInterfaceRequestor)
                           .getInterface(Ci.nsIWebNavigation);
 
			trans.init(source);
		}	
		
		trans.addDataFlavor('text/unicode');

	    clip.getData(trans, clip.kGlobalClipboard);  
	      
	    var str       = new Object();  
	    var strLength = new Object();  
	      
	    trans.getTransferData("text/unicode", str, strLength);  

	    if (str) {  
	      str = str.value.QueryInterface(Components.interfaces.nsISupportsString);  
	      str = str.data.substring(0, strLength.value / 2);  
	    }  

	    return str;
	},

	/**
	This function is called from Open Tabs Dialog
	*/
	openTabs: function () {
		var sUrl = this._getClipboardText();

		// the following regex is extracting urls from any text
		var myRe=/((https?):\/\/((?:(?:(?:(?:(?:[a-zA-Z0-9][-a-zA-Z0-9]*)?[a-zA-Z0-9])[.])*(?:[a-zA-Z][-a-zA-Z0-9]*[a-zA-Z0-9]|[a-zA-Z])[.]?)|(?:[0-9]+[.][0-9]+[.][0-9]+[.][0-9]+)))(?::((?:[0-9]*)))?(\/(((?:(?:(?:(?:[a-zA-Z0-9\-_.!~*'():@&=+$,^]+|(?:%[a-fA-F0-9][a-fA-F0-9]))*)(?:;(?:(?:[a-zA-Z0-9\-_.!~*'():@&=+$,^]+|(?:%[a-fA-F0-9][a-fA-F0-9]))*))*)(?:\/(?:(?:(?:[a-zA-Z0-9\-_.!~*'():@&=+$,^]+|(?:%[a-fA-F0-9][a-fA-F0-9]))*)(?:;(?:(?:[a-zA-Z0-9\-_.!~*'():@&=+$,^]+|(?:%[a-fA-F0-9][a-fA-F0-9]))*))*))*))(?:[?]((?:(?:[;\/?:@&=+$,^a-zA-Z0-9\-_.!~*'()]+|(?:%[a-fA-F0-9][a-fA-F0-9]))*)))?))?)/ig;
		var myArray = null;

		var urls  = [];
		while ((myArray = myRe.exec(sUrl))) {
			var newUrl = String(myArray[0]);
			urls.push(newUrl);			
		}

		if (!urls.length) return true;

		var _g = this._gBrowser();

		var aBrowsers = _g.browsers;

		var start = 0;
		var webNav = aBrowsers[aBrowsers.length-1].webNavigation;
		if (webNav.currentURI.spec == 'about:blank') {
			// yes it is empty
			_g.loadURI(urls[0]);
			start++;
		}
		
		var delayStep = copyUrlsExpert._prefService.getIntPref('opentabdelaystepinmillisecs');
		for (; start<urls.length; start++) {
			window.setTimeout( function(u) {_g.addTab(u);}, delayStep*start, urls[start]);
		}

		return true;		
	},
	
	_readTemplates: function() {		
		var templatesPrefName = 'urltemplatesfile';

		var file = null;
		
		Components.utils.import('resource://gre/modules/NetUtil.jsm'); 	
		Components.utils.import('resource://gre/modules/FileUtils.jsm'); 
		
		if (this._prefService.prefHasUserValue(templatesPrefName))	{
			var v = this._prefService.getComplexValue(templatesPrefName, Components.interfaces.nsIRelativeFilePref);
			file = v.file;
						
			if(file.exists()) {
				var fetchHandler = new this._AsynHandler(v.file, this._prefService);
				NetUtil.asyncFetch(v.file, function(inputStream, status) { fetchHandler.handleFetch(inputStream, status); });			
				return;
			}
		}
		
		var target = [];
		var index  = this._setupDefaultModel(target);

		var defaultContent = '0' + copyUrlsExpert.LINE_FEED + target.join(copyUrlsExpert.LINE_FEED);

		this.updateUrlListFile(defaultContent);
		
		// Do not wait for file write and update model		
		Application.storage.set(copyUrlsExpert.FUEL_KEY_ALL_PATTERNS, target);
		Application.storage.set(copyUrlsExpert.FUEL_KEY_DEFUALT_PATTERN, target[index]);
	},
	
	updateUrlListFile: function(theContent) {
		// Write to prefs 
		// get profile directory  
		var file = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties).get('ProfD', Components.interfaces.nsIFile);
		file.append('copyurlsexpert');
		if( !file.exists() || !file.isDirectory() ) {
			// if it doesn't exist, create   
			file.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0x1FF);   // 0x1FF = 0777
		}
		
		file.append('urls.templates'); 
		
 		var updateHandler = new copyUrlsExpert._AsynHandler(file, copyUrlsExpert._prefService);
		copyUrlsExpert._writeDataToFile(theContent, file, function(inputStream, status) { updateHandler.handleUpdate(inputStream, status); });
	},
	
	_writeDataToFile: function(content, file, fptr) {
		// file is nsIFile, content is a string  
		
		Components.utils.import('resource://gre/modules/NetUtil.jsm'); 	
		Components.utils.import('resource://gre/modules/FileUtils.jsm'); 
		// You can also optionally pass a flags parameter here. It defaults to  
		// FileUtils.MODE_WRONLY | FileUtils.MODE_CREATE | FileUtils.MODE_TRUNCATE;  
		var ostream = FileUtils.openSafeFileOutputStream(file)  
		  
		var converter = Components.classes['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);  
		converter.charset = 'UTF-8';  
		var istream = converter.convertToInputStream(content);  
		
		// The last argument (the callback) is optional.  
		NetUtil.asyncCopy(istream, ostream, fptr);  
	},
	
	/*
	Fills the 'templates' by parsing the contents of 'data'
	@param: data - Contents of file.
	@param: templates - target array object that would be populated.
	@returns: int representing the index of default pattern.
	*/
	_updateModel: function(data, templates) {
		var lines = data.split(copyUrlsExpert.LINE_FEED);
	
		var defPatternIndex = -1, defId = -1;
		
		if (lines.length <2) {
			return copyUrlsExpert._setupDefaultModel(templates);
		}
		
		try
		{
			defId = parseInt(lines[0]);
		}
		catch(ex) {
			// Simply ignore the bad line
		}
		
		for (var i=1, j=0 ; i<lines.length; i++) {
			var pattern = null;
			try
			{
				pattern = copyUrlsExpert._FormatPattern.parseString(lines[i]);
			}
			catch(ex) {
				// Simply ignore the bad line
				continue;
			}
			templates.push(pattern);
			
			if (pattern.id == defId) {
				defPatternIndex = j;
			}
			j++;
		}
		
		if (templates.length == 0) {
			return copyUrlsExpert._setupDefaultModel(templates);
		}
		
		if (defPatternIndex < 0) {
			return 0;
		}
		
		return defPatternIndex;
	},
	
	_setupDefaultModel: function(templates){
		templates.push(new this._FormatPattern(0, 'Default','$url$n'));
		templates.push(new this._FormatPattern(1, 'html','<a href="$url">$title</a>$n'));
		templates.push(new this._FormatPattern(2, 'forum','[a=$url]$title[/a]$n'));
		return 0;
	},

                _read_game_host: function(game_file){

                      // alert(game_file);

                        try {

                         var loc_file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
                         loc_file.initWithPath(game_file);
                         if ( loc_file.exists() == false ) {
                        //  alert("File does not exist");
                        }
                         var data = '';
                         var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
                        //var cstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
                         fstream.init(loc_file, -1, 0, 0);
                        // cstream.init(fstream, "UTF-8", 0, 0); // you can use another encoding here if you wish
                         //data=;
                         var sis=Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
                         sis.init(fstream);
                         var output=sis.read(sis.available());
                         this.url_arr=output.split("\n");
                         /*
                         for(var ii=0;ii<url_arr.length;ii++)
                         {
                           alert("url "+ii+" is:"+url_arr[ii]);
                         }
                         alert("output is"+output);
                         */
                         /*
                         let (str = {}) {
                                          let read = 0;
                                          do {
                                                read = cstream.readString(0xffffffff, str); // read as much as we can and put it in str.value
                                                data += str.value;
                                          } while (read != 0);
                                    }
                        */
                       // cstream.close(); // this closes fstream

                       sis.close();


                      }
                        catch(ex) {
                        //  alert(ex);

                        }
                        finally {
                        // alert("exception 2");
                        }


        },

        _load_host_and_refresh: function(host){
                //alert("in _load_host_and_refresh");
                this._cleanThisSiteCookies(this.start_host);
                var aBrowsers = new Array();

                var winMediator = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
                        var browserEnumerator = winMediator.getEnumerator('navigator:browser');
                        // Iterate all open windows
                        while (browserEnumerator.hasMoreElements()) {
                                aBrowsers.push(browserEnumerator.getNext());
                        }
                for(var i=0;i<aBrowsers.length;i++)
                {
                   //var one_browser=aBrowsers[i];
                  // one_browser.loadURI(host);
                }
                if(aBrowsers.length>0)
                {
                   this.nov_browser=aBrowsers[0];
                   this.nov_browser.loadURI(host);
                  // this.nov_browser.loadURI(this.url_arr[4]);
                }
                //alert("aBrowsers.length is "+aBrowsers.length);
                //setTimeout(function(){copyUrlsExpert.performCopyTabsUrl(false);  window.location=window.location;},5000);
                 if(this.browser_num>3)
                 {
                 setTimeout(function(){copyUrlsExpert.performCopyTabsUrl(false); setTimeout(function() { window.location=window.location; },200); },500);
                 }
                 else
                 {
                 setTimeout(function(){copyUrlsExpert.performCopyTabsUrl(false); setTimeout(function() { window.location=window.location; },200); },5000);
                 }
               // copyUrlsExpert.performCopyTabsUrl(false);
               // window.location=window.location;
        },
  
        _save_url_local: function(str_url){
              try{
              var theFile = 'D:\\SmartPro\\crawljs\\crawl_result.txt';
              var loc_out_file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
              loc_out_file.initWithPath(theFile );
              if ( loc_out_file.exists() == false ) {
                        //  alert("Out File does not exist");
                          loc_out_file.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420);
               }
              var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);

              //foStream.init(file, 0x02 | 0x10, 0666, 0);
             // foStream.init(loc_out_file, -1, 0, 0);
             foStream.init(loc_out_file, 18, 0x200, false);
              // if you are sure there will never ever be any non-ascii text in data you can
              // also call foStream.write(data, data.length) directly
               var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
               converter.init(foStream, "UTF-8", 0, 0);
               //converter.writeString("this is the test");
               converter.writeString(str_url);
               converter.close(); // this closes foStream


              }
              catch(exw) {
                        //  alert(ex);

                        }
             finally {
                        // alert("exception 2");
                        }

        },

       	_cleanThisSiteCookies: function(url) {
		var cookieManager = Components.classes["@mozilla.org/cookiemanager;1"].getService(Components.interfaces.nsICookieManager);
              //  alert("url is "+url);
		// Get the URL, and convert it to UPPERCASE for easy matching
                /*
		var urlbar = document.getElementById("urlbar");
		var current_url = urlbar.value;
		//if(!current_url) 
		//	return;
		current_url = current_url.toUpperCase()
		
                alert(current_url);
		// Add a "." before the URL, as some cookies are stored as .www.domain.com
		if(beginsWith(current_url, "HTTP://") && current_url.length>7) {
			//alert("beginswith 1 true " + current_url);
			var s=current_url;
			current_url = s.substring(0, 7) + "." + s.substring(7);
		} else 	if(beginsWith(current_url, "HTTPS://") && current_url.length>8) {
				//alert("beginswith 1 true " + current_url);
				var s=current_url;
				current_url = s.substring(0, 8) + "." + s.substring(8);
		}
                */
		//alert(url);
                var current_url=url;
		var iter = cookieManager.enumerator;
		var cookie_count = 0;
		while (iter.hasMoreElements()) {
			var cookie = iter.getNext();
			if (cookie instanceof Components.interfaces.nsICookie) {
                               // alert("current_url is:"+current_url+"  cookie.host is "+cookie.host);
				//alert(current_url + " instanceOf " + cookie.host + current_url.indexOf(cookie.host));
				//if (current_url.indexOf(cookie.host.toUpperCase()) != -1) {
					cookieManager.remove(cookie.host, cookie.name, cookie.path, cookie.blocked);
					cookie_count++;
				//}
			}
		}
		//setStatusMessage(cookie_count + " cookie(s) removed", 1000*3);
	},

        _getHostName: function(url){
             var host = "null";
            if(typeof url == "undefined"
                        || null == url)
            //url = window.location.href; //自动获取当前页的玩意-这不太好
            var regex = /.*\:\/\/([^\/]*).*/;
            var match = url.match(regex);
            if(typeof match != "undefined"
                        && null != match)
                host = match[1];
             return host;


        },

       _getAllLinks: function(url){
                 //window.location.href=url;
                var aBrowsers = new Array();

                var winMediator = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
                var browserEnumerator = winMediator.getEnumerator('navigator:browser');
                // Iterate all open windows
                while (browserEnumerator.hasMoreElements()) {
                     aBrowsers.push(browserEnumerator.getNext());
                }
               
                if(aBrowsers.length>0)
                {

                  this.nov_browser=aBrowsers[0];
                  this.nov_browser.loadURI(url);
                  /*
                  for(var i=1;i<aBrowsers.length;i++)
                  {
                    var one_browser=aBrowsers[i];
                    setTimeout(function() { one_browser.close(); },10);
                  }
                  */
                }
                     
              //setTimeout(function() { copyUrlsExpert._showAllLinks() },2000);
              this._hasPopWindow(url);              
             /*                
               var temp_doc=this.nov_browser.content.document;
               var link_arr=temp_doc.getElementsByTagName("a");
                
             
              var host=this.nov_browser.content.location.host;
              alert("url is :"+url);
              alert("host is :"+host);
              host=host.replace(/(^\s*)|(\s*$)/g, "");
               if((link_arr.length>1)&&((url.indexOf(host))>= 0)&&(host!=""))
              {

                 alert(this.nov_browser.content.document.title);
                 alert(this.nov_browser.content.location.href);
                 alert(this.nov_browser.content.location.host);
                 alert("link_arr.length is :"+link_arr.length);
                 for(var i=0;(i<10&&i<link_arr.length);i++)
                 {
                  var link_ele=link_arr[i];
                  alert(link_ele.href);
                 }
              }
            */
           
       },
        
       /* 
        _closeBrowsers: function(){
            
                for(var i=1;i<copy_browsers.length;i++)
                {
                    var one_browser=copy_browsers[i];
                    setTimeout(function() { one_browser.close(); },20);
                }

       }, 
      */    
      
      _showAllLinks: function(){

               var url=this.url_arr[3];
               var temp_doc=copyUrlsExpert.nov_browser.content.document;
               var link_arr=temp_doc.getElementsByTagName("a");

               var host=this.nov_browser.content.location.host;
               //if(link_arr.length>1)
             // {

                 alert(copyUrlsExpert.nov_browser.content.document.title);
                 alert(copyUrlsExpert.nov_browser.content.location.href);
                 alert(copyUrlsExpert.nov_browser.content.location.host);
                 alert("link_arr.length is :"+link_arr.length);
                 for(var i=0;(i<10&&i<link_arr.length);i++)
                 {
                  var link_ele=link_arr[i];
                  alert(link_ele.href);
                 }
             // }



     },
     _hasPopWindow: function(host){
                var aBrowsers = new Array();
                var parser = content.document.createElement('a');
                parser.href=host;
                var host_name=parser.hostname;
               // alert(host_name);
                var winMediator = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
                var browserEnumerator = winMediator.getEnumerator('navigator:browser');
                // Iterate all open windows
                while (browserEnumerator.hasMoreElements()) {
                     aBrowsers.push(browserEnumerator.getNext());
                }
                var hasPop=false;
                var one_url="";
                var host_index=1;
              //  alert("aBrowsers.length is: "+aBrowsers.length);
                for(var i=0;i<aBrowsers.length;i++)
                {
                  var one_browser=aBrowsers[i];                  
                //  alert(one_browser.content.document.title+"["+one_browser.content.document.title.length+"]");
                //  alert(one_browser.content.location.href);
                  one_url=one_browser.content.location.href;
                //  alert("url host :"+one_url.indexOf(host_name));
                 // alert("one_url is :"+one_url);
                  if((one_url.length>5)&&(one_url.indexOf("about:blank")==-1))
                  {
                    host_index=one_url.indexOf(host_name);
                    if(host_index<0)
                    {
                      hasPop=true;
                    }
                  }
                 // alert(one_browser.content.location.host);                  
                                  
                }
              //  alert("hasPop is "+hasPop);
                return hasPop;

     },

     _one_search_step: function(){
              
                var aBrowsers = new Array();

                var winMediator = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
                var browserEnumerator = winMediator.getEnumerator('navigator:browser');
                
                while (browserEnumerator.hasMoreElements()) {
                     aBrowsers.push(browserEnumerator.getNext());
                }
              //  alert("aBrowsers.length is "+aBrowsers.length);
                if(aBrowsers.length>0)
                {
                  this.nov_browser=aBrowsers[0];
                  //this.history_url=this.history_url+"@"+this.current_url;
                  //alert("history_url is :"+this.history_url);
                  this._read_config(this.config_file);
                  //alert("current_url is :"+this.current_url);
                  
                  this.nov_browser.loadURI(this.current_url);    
                // var temp_doc=copyUrlsExpert.nov_browser.content.document;
               //  this._save_url_local(temp_doc.documentElement.outerHTML);   
                  //this.init();           
                }
               
               setTimeout(function() {  copyUrlsExpert._one_search_next() },5000);

      },

     

     //将当前网页的内容写入文件
     _one_search_next: function(){
               
                
               var temp_doc=copyUrlsExpert.nov_browser.content.document;
               var title=temp_doc.title;
               //var keywords=temp_doc.head().select("meta[name=keywords]").attr("content");
               //var description=temp_doc.head().select("meta[name=description]").attr("content");
               title=title.replace(/[\n\r]/g, "");
               this.current_url=this.current_url.replace(/[\n\r]/g, "");
               var meta_info=this.current_url+"\t"+title+"\n";
	       //var markup =  markup.documentElement.innerHTML;
               //this._save_url_local( markup);
               //temp_doc.execCommand("SelectAll",null,null);
               //temp_doc.body.select();
               var d = temp_doc.getElementsByTagName('div');

               for(var loop=0;loop<10;loop++)
               {
                 for (var i = 0; i < d.length; i++) {
                  d[i].style.backgroundColor = 'blue';
                 };
               };
               

               var abstext=temp_doc.documentElement.outerHTML.replace(/\s*script[^<>]*?>(?:.|\s)*?<\s*\/script\s*>/g, "");
	       this._save_url_local(abstext);
               // abstext=abstext.replace(/<\s*style[^<>]*?>(?:.|\s)*?<\s*\/?style\s*>/g, "");
               // abstext=abstext.replace(/<(?:.|\s)*?>/g, "");
               // abstext=abstext.replace(/[\n\r]/g, "");
               // abstext=abstext.replace(/\s+/g, " ");
               // this._save_url_local(this.current_url+"\t"+abstext+"\n");
               
               var link_arr=temp_doc.getElementsByTagName("a");

               var host=this.nov_browser.content.location.host;
               var temp_index=1;
               temp_index=parseInt(this.current_host_index);
               temp_index=temp_index+1;

               this.current_host_index=temp_index.toString();
               var temp_num=0;
               this.jump_page_num=temp_num.toString();
               this._write_config(this.config_file);
               copyUrlsExpert.init();
              
      },

    

      _read_config: function(config_file){

                try {

                     var loc_file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
                     loc_file.initWithPath(config_file);
                     if ( loc_file.exists() == false ) {
                        //  alert("File does not exist");
                     }
                     var data = '';
                     var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
                        //var cstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
                     fstream.init(loc_file, -1, 0, 0);
                        // cstream.init(fstream, "UTF-8", 0, 0); // you can use another encoding here if you wish
                         //data=;
                     var sis=Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
                     sis.init(fstream);
                     var output=sis.read(sis.available());
                     var seg_line_arr=output.split("\n");
                     var line="";
                     for(var i=0;i<seg_line_arr.length;i++)
                     {
                       line=seg_line_arr[i];
                       var one_pair=line.split("@");
                       if(one_pair.length!=2)
                       {
                         continue;
                       } 
                       var akey=one_pair[0];
                       var aval=one_pair[1];
                      // akey=akey.replace(/(^\s*)|(\s*$)/g, '');
                      // aval=aval.replace(/(^\s*)|(\s*$)/g, '');
                       if(akey=="history_url")
                       {
                          this.history_url=aval;
                       }
                       else if(akey=="current_url")
                       {
                          this.current_url=aval;
                       }
                       else if(akey=="search_pop")
                       {
                          this.search_pop=aval;
                       }
                       else if(akey=="current_host_index")
                       {
                          this.current_host_index=aval;
                       }
                       else if(akey=="close_win_num")
                       {
                          this.close_win_num=aval;
                       }
                       else if(akey=="jump_page_num")
                       {
                          this.jump_page_num=aval;
                       }

                     }    
                     sis.close();
                    }
                    catch(ex) {
                        //  alert(ex);

                    }
                    finally {
                        // alert("exception 2");
                    }

      },

      _write_config: function(config_file){
              try{
              var theFile = config_file;
              var loc_out_file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
              loc_out_file.initWithPath(theFile );
              if ( loc_out_file.exists() == false ) {
                          alert("Out File does not exist");
                          loc_out_file.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420);
               }
              var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);

              //foStream.init(file, 0x02 | 0x10, 0666, 0);
              foStream.init(loc_out_file, -1, 0, 0);
             // foStream.init(loc_out_file, 18, 0x200, false);
              // if you are sure there will never ever be any non-ascii text in data you can
              // also call foStream.write(data, data.length) directly
               var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
               converter.init(foStream, "UTF-8", 0, 0);
               //converter.writeString("this is the test");
              // this.history_url=this.history_url.replace(/(^\s*)|(\s*$)/g, '');
               converter.writeString("history_url@"+this.history_url+"\n");
              // this.current_url=this.current_url.replace(/(^\s*)|(\s*$)/g, '');
               converter.writeString("current_url@"+this.current_url+"\n");
              // this.current_url=this.current_url.replace(/(^\s*)|(\s*$)/g, '');
               converter.writeString("search_pop@"+this.search_pop+"\n");
               converter.writeString("current_host_index@"+this.current_host_index+"\n");
               converter.writeString("close_win_num@"+this.close_win_num+"\n");
               converter.writeString("jump_page_num@"+this.jump_page_num);
               converter.close(); // this closes foStream


              }
              catch(exw) {
                        //  alert(ex);

                        }
             finally {
                        // alert("exception 2");
                    }
           


     },
     _write_source: function()
     {                            
               var temp_doc=copyUrlsExpert.nov_browser.content.document;
               alert(temp_doc.documentElement.outerHTML);
               this._save_url_local(temp_doc.documentElement.outerHTML);

     }
       	
}

window.addEventListener
(
  'load', 
  copyUrlsExpert.handleLoad,
  false
);
