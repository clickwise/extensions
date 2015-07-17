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
  /**
   * Says 'Hello' to the user.
   */
  sayHello : function(aEvent) {
    let stringBundle = document.getElementById("xulschoolhello-string-bundle");
    let message = stringBundle.getString("xulschoolhello.greeting.label");

    window.alert(message);
	var urls=this._read_my_file("D:\\projects\\tool_extensions\\test.txt");
	//for(var i=0;i<urls.length;i++)
    //{
    //   alert("url "+i+" is:"+urls[i]);
    //}
	this._my_post("test");
  },
  _read_my_file: function(game_file){

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
		
        var lines=output.split("\n");                   
        sis.close();
        return lines;
       }
       catch(ex) {
          //  alert(ex);
       }
       finally {
          // alert("exception 2");
       }
  },
  _my_post: function(post_content){
	var xml = XMLHttpRequest();
    xml.open("POST", "http://weibo.com/aj/mblog/add?ajwvr=6&__rnd=1437124515181", true); 
    xml.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8"); 
	xml.send('location=v6_content_home&appkey=&style_type=1&pic_id=&text=test&pdetail=&rank=0&rankid=&module=stissue&pub_type=dialog&_t=0');     
  }  
	  
};
