/**
 * XULSchoolChrome namespace.
 */
if ("undefined" == typeof(XULSchoolChrome)) {
  var XULSchoolChrome = {};
};

/**
 * Controls the browser overlay for the Hello World extension.
 */
XULSchoolChrome.BrowserOverlay = {
   url_arr : null,
  /**
   * Says 'Hello' to the user.
   */
  sayHello : function(aEvent) {
    let stringBundle = document.getElementById("xulschoolhello-string-bundle");
    let message = stringBundle.getString("xulschoolhello.greeting.label");

    window.alert(message);
	this._read_file("D:\\projects\\tool_extensions\\test.txt");
  },
  _read_file: function(game_file){

    try {
        alert("read file");
        var loc_file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        loc_file.initWithPath(game_file);
        if ( loc_file.exists() == false ) {
           alert("File does not exist");
        }
        var data = '';
        var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);

        fstream.init(loc_file, -1, 0, 0);
        var sis=Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
        sis.init(fstream);
        var output=sis.read(sis.available());
        this.url_arr=output.split("\n");
                       
        for(var ii=0;ii<this.url_arr.length;ii++)
        {
           alert("url "+ii+" is:"+this.url_arr[ii]);
        }
         
        sis.close();

       }
       catch(ex) {
          //  alert(ex);
       }
       finally {
          // alert("exception 2");
       }
  }
};
