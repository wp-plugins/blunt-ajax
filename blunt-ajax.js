  
  function bluntAjax(settings) {
    if (!bluntAjaxOptions) {
      return;
    }
    var debug = bluntAjaxOptions.debug;
    var url = bluntAjaxOptions.url;
    var error = false;
    var callback = bluntAjaxDefaultCallback;
    var parameters = '';
    var method = 'GET';
    var element_id = false;
    var encoding = 'none';
    var pass = false;
    if (typeof(settings['debug']) != 'undefined') {
      if (typeof(settings['debug']) == 'boolean') {
        debug = settings['debug'];
      } else {
        error = true;
        if (debug) {
          // of course this would mean the debug must be set to true by php code
          alert('Blunt Ajax: '+settings[i]+' is not a valid value for debug');
        }
      }
    }
    for(i in settings) {
      switch(i) {
        case 'debug':
          /*
          // debug moved out of loop so it's order in arguments does not matter
          // the code below left temporarily, will be removed in the future
          if (typeof(settings[i]) == 'boolean') {
            debug = settings[i];
          } else {
            error = true;
            if (debug) {
              alert('Blunt Ajax: '+settings[i]+' is not a valid value for debug');
            }
          }
          */
          break;
        case 'encoding':
          // set encoding for parameter values
          var encoding_error = true;
          if (settings[i] && typeof(settings[i]) == 'string') {
            var value = settings[i];
            if (value == 'none' || value == 'escape' || value == 'uri') {
              incoding_error = false;
              encoding = value;
            }
          }
          if (incoding_error) {
            error = true;
            if (debug) {
              alert('Blunt Ajax: '+settings[i]+' is not a valid encoding');
            }
          }
          break;
        case 'url':
          if (settings[i] && typeof(settings[i]) == 'string') {
            url = settings[i];
          } else {
            error = true;
            if (debug) {
              alert('Blunt Ajax: '+settings[i]+' is not a valid URL');
            }
          }
          break;
        case 'callback':
          if (settings[i] && typeof(settings[i]) == 'function') {
            callback = settings[i];
          } else {
            error = true;
            if (debug) {
              alert('Blunt Ajax: '+settings[i]+' is not a valid callback function');
            }
          }
          break;
        case 'method':
          var method_error = true;
          if (settings[i] && typeof(settings[i]) == 'string') {
            var string = settings[i];
            string = string.toUpperCase();
            if (string == 'POST' || string == 'GET') {
              method_error = false;
              method = string;
            }
          }
          if (method_error) {
            error = true;
            if (debug) {
              alert('Blunt Ajax: '+settings[i]+' is not a valid method');
            }
          }
          break;
        case 'element_id':
          if (settings[i] && typeof(document.getElementById(settings[i])) != 'undefined') {
            element_id = settings[i];
          } else {
            error = true;
            if (debug) {
              alert('Blunt Ajax: '+settings[i]+' is not a valid element id in this document');
            }
          }
          break;
        case 'parameters':
          // parameters will need to be formatted just before call
          // to allow them to be encoded properly and allow the encoding value to be set in any order
          // this will need to be removed
          // ********************************************************************************
          if (settings[i] && typeof(settings[i]) == 'object') {
            parameters = settings[i];
            /*
            this code will be removed
            for (j in settings[i]) {
              if (parameters != '') {
                parameters += '&';
              }
              parameters += j+'='+settings[i][j];
            }
            */
          } else {
            error = true;
            if (debug) {
              alert('Blunt Ajax: the value supplied for parameters is not a valid Object');
            }
          }
          break;
        case 'pass':
          pass = settings[i];
          break;
        default:
          // do nothing
          break;
      } // end switch i
    } // end for i in settings
    if (error) {
      return;
    }
    
    var httpConnection = false;
    var readError = false;
    var httpStatus = false;
    var statusText = false;
    var server_response = false;
    var xmlHttp = createXmlHttpRequestObject();
    
    process();
    
    function formatParameters(args, base) {
      // will create string from parameters including proper encoding
      // this is a recursive function to allow sending multidimensional objects
      // ********************************************************************************
      var parameter_string = '';
      if (!base) {
        base = '';
      }
      for (i in args) {
        // create variable name
        var name = i;
        if (base != '') {
          name = base+'['+name+']';
        }
        if (typeof(args[i]) == 'object') {
          // recursive call
          var parameter_string_add = formatParameters(args[i], name);
          if (parameter_string_add != '') {
            parameter_string += '&'+parameter_string_add;
          }
        } else {
          if (parameter_string != '') {
            parameter_string += '&';
          }
          // create properly escaped value
          var value = args[i];
          //alert(encoding);
          switch(encoding) {
            case 'escape':
              // escape value
              value = escape(value);
              break;
            case 'uri':
              // encodeURIComponent
              value = encodeURIComponent(value);
              break;
            case 'none':
            default:
              // do nothing to value
              break;
          } // end switch encoding
          parameter_string += name+'='+value;
        } // end if object else string
      } // end for i in args
      return parameter_string;
    } // end function formatParameters
    
    function createXmlHttpRequestObject() {
      // create new XMLHttpRequest Object
      var xmlHttp = false;
      
      // will store the reference to the XMLHttpRequest object
      // this should work for all browsers except IE6 and older
      try {
        // try to create XMLHttpRequest object
        xmlHttp = new XMLHttpRequest();
      }
      catch(e) {
        // failed to create XMLHttpRequest object
        // assume IE6 or older
        var XmlHttpVersions = new Array("MSXML2.XMLHTTP.6.0",
                                        "MSXML2.XMLHTTP.5.0",
                                        "MSXML2.XMLHTTP.4.0",
                                        "MSXML2.XMLHTTP.3.0",
                                        "MSXML2.XMLHTTP",
                                        "Microsoft.XMLHTTP");
        // try every prog id until one works
        for (var i=0; i<XmlHttpVersions.length && !xmlHttp; i++) {
          try { 
            // try to create XMLHttpRequest object
            xmlHttp = new ActiveXObject(XmlHttpVersions[i]);
          } 
          catch (e) {}
          // failed to create object
          // do nothing and try the next
        }
      }
      // returns false if we were unable to create any object
      return xmlHttp;
    } // end function createXmlHttpRequestObject
    
    function process() {
      // make request to server
      // will need to format parameters here
      //****************************************************************************
      if (typeof(parameters) == 'object') {
        // call function to build query string
        parameters = formatParameters(parameters);
        //alert(parameters);
      } // end if parameters is object
      var error = false;
      var post_args;;
      if (xmlHttp) {
        httpConnection = true;
        if (method == 'GET') {
          if (parameters != '') {
            url = url + '?' + parameters;
          }
          post_args = null;
        } else {
          // method == 'POST';
          post_args = parameters;
        }
        try {
          xmlHttp.open(method, url, true);
          xmlHttp.onreadystatechange = handleRequestStateChange;
          if (method == 'POST') {
            //Send the proper header information along with the request
            xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlHttp.setRequestHeader("Content-length", post_args.length);
            xmlHttp.setRequestHeader("Connection", "close");
          }
          xmlHttp.send(post_args);
        }
        catch (e) {
          // unable error openenng connection
          statusText = 'Error sending request';
          error = true;
        }
      }
      if (error) {
        bluntAjaxReturn(callback, server_response, element_id, pass, httpConnection, 
                        httpStatus, statusText, readError, debug);
      }
    } // end function process
    
    function handleRequestStateChange() {
      var error = false
      // wait for request to be complete and then process returned data
      readError = '';
      if (xmlHttp.readyState == 4) {
        // when readyState is 4 (done), we also read the server response
        // continue only if HTTP status is "OK"
        if (xmlHttp.status == 200)  {
          httpStatus = 200;
          statusText = xmlHttp.statusText;
          try {
            // read the message from the server
            server_response = xmlHttp.responseText;
          }
          catch(e) {
            // display error message
            //alert("Error reading the response: " + e.toString());
            readError = e.toString();
          }
        } else {
          // display status message
          //alert("There was a problem retrieving the data:\n" + xmlHttp.statusText);
          httpStatus = xmlHttp.status;
          statusText = xmlHttp.statusText;
        }
        // call the function to deal with the server response
        // pass status and errors to server response processor
        // it is up to that function to deal with any errors
        //alert(div);
        //alert(pass);
        bluntAjaxReturn(callback, server_response, element_id, pass, httpConnection, 
                        httpStatus, statusText, readError, debug);
      }
    } // end function handleRequestStateChange
    
  } // end function bluntAjax
  
  function bluntAjaxReturn(callback, response, element_id, pass, httpConnection, 
                           httpStatus, statusText, readError, debug) {
    // this function will always be called to check and report errors
    // then the callback funtion will be called
    if (httpConnection) {
      if (httpStatus == 200) {
        if (readError == '') {
          // request was successfull
          // call the callback function
          callback(response, element_id, pass);
        } else if (debug) {
          alert('Blunt Ajax: '+readError);
        }
      } else if (debug) {
        alert('Blunt Ajax: '+httpStatus+': '+statusText);
      }
    } else if (debug) {
      alert('Blunt Ajax: Failed to create an http connection!');
    }
  } // end function bluntAjaxReturn 
  
  function bluntAjaxDefaultCallback(response, element_id, pass) {
    if (element_id !== false) {
      document.getElementById(element_id).innerHTML = response;
    } else {
      // element_id not given alert response
      alert(response);
    }
  } // end function bluntAjaxDefaultCallback