var reader; //GLOBAL File Reader object for demo purpose only

/**
 * Check for the various File API support.
 */
function checkFileAPI() {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    reader = new FileReader();
    return true; 
  } else {
    alert('The File APIs are not fully supported by your browser. Fallback required.');
    return false;
  }
}

/**
 * read text input
 */
function readText(filePath) {
  var output = ""; //placeholder for text output
  if(filePath.files && filePath.files[0]) {           
    // We have html5 filelist support
    reader.onload = function (e) {
      output = e.target.result;
      displayContents(output);
    };
    reader.readAsText(filePath.files[0]);
  } else if(ActiveXObject && filePath) {
    // Fallback to IE 6-8 support via ActiveX
    try {
      reader = new ActiveXObject("Scripting.FileSystemObject");
      var file = reader.OpenTextFile(filePath, 1); //ActiveX File Object
      output = file.ReadAll();
      file.Close();
      displayContents(output);
    } catch (e) {
      if (e.number == -2146827859) {
        alert('Unable to access local files due to browser security ' +
              'settings. To overcome this, go to Tools->Internet ' +
              'Options->Security->Custom Level. ' + 
              'Find the setting for "Initialize and script ActiveX controls ' +
              'not marked as safe" and change it to "Enable" or "Prompt"'); 
      }
    }       
  } else {
    // this is where you could fallback to Java Applet, Flash or similar
    return "";
  }
  return output;
}   

/**
 * display content using a basic HTML replacement
 */
function displayContents(txt) {
  var textArea = document.getElementById('CODE_ID');
  textArea.value = txt;
}
