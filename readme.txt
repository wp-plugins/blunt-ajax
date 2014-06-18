=== Blunt AJAX ===
Contributors: Hube2
Tags: AJAX, JavaScript
Requires at least: 2.8
Tested up to: 3.9
Stable tag: 1.1.0
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=hube02%40earthlink%2enet&lc=US&item_name=Donate%20to%20Blunt%20AJAX%20WordPress%20Plugin&no_note=0&cn=Add%20special%20instructions%20to%20the%20seller%3a&no_shipping=1&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

AJAX in WordPress Without Frameworks

== Description ==

This script is for developers like myself that don't want to load some monolithic JavaScript framework just so they can do a bit of AJAX.

Document for developers for use of this plugin can be found on the [Other Notes](http://wordpress.org/plugins/blunt-ajax/other_notes/#Documentation-for-Developers) page.

This is an adaptation of an AJAX script that I've been using and updating since around 2007. I like my scripts small and to the point. Hopefully others will find it useful.

I am open to suggestions for improvement of this plugin. Submit a support request here or on [GitHub](https://github.com/Hube2/blunt-ajax)


== Installation ==

1. Upload the Blunt GA plugin to the plugin folder of your site
2. Activate it from the Plugins Page
3. Read the [Documentation](http://wordpress.org/plugins/blunt-ajax/other_notes/#Documentation-for-Developers)


== Screenshots ==

There are no screenshots. This is purely for developement and there is no user interface. See [Other Notes](http://wordpress.org/plugins/blunt-ajax/other_notes/#Documentation-for-Developers) for documentation.

== Documentation for Developers ==

For more information about AJAX in WordPress see the [WordPress Codex](http://codex.wordpress.org/AJAX_in_Plugins), the best information can be found on the [AJAX in Plugins](http://codex.wordpress.org/AJAX_in_Plugins "AJAX in Plugins") page. 

This plugin does not automatically add the Blunt AJAX script to every page of your site. It simply registers the script so that it is available to be included when you need it. You tell WordPress that you need the script by including the script handle as one of the scripts that your script depends on when you [register](http://codex.wordpress.org/Function_Reference/wp_register_script "Function Reference/wp register script") or [enqueue](http://codex.wordpress.org/Function_Reference/wp_enqueue_script "Function Reference/wp enqueue script") your script. The main thing that this means is that in order to use Blunt AJAX you must use one of these built in WordPress functions to include your own scirpts. This promotes the proper way to do it and clean coding standards.

= Purpose of Blunt AJAX =
The sole purpose of Blunt AJAX is to make an http request and relay the response to a callback function. Blunt AJAX has no facility outside of a simple default callback function to deal with the response. You must write the JavaScript code to call Blunt AJAX and also the callback function to react to the server response if you wish to do more than what the default callback function can do; which is to either put the response into the inner HTML of some element or to show the response in a JavaScript alert message.

= How to Include Blunt Ajax =
The handle of the Blunt Ajax script is **"blunt-ajax"**.
Here is an example bit of code that enqueues a script and causes the Blunt Ajax script to load:
`&lt;?php wp_enqueue_script($handle, $src, array('blunt-ajax')); ?&gt;`

= Usage =
In your javascript code you call Blunt AJAX something like this:
`&lt;script type="text/javascript"&gt;
  var arguments = {debug:false,
                   url:"/wp-admin/admin-ajax.php",
                   callback: my_callback_function,
                   encoding: 'none',
                   parameters:{action:'action_name',
                               nonce:'12345678',
                               my_parameter:'Some Value"'},
                   method:"GET",
                   element_id:'my-id',
                   pass:'any value type or value'};
  bluntAjax(arguments);
&lt;/script&gt;`

**Arguments may be specified in any order**

**debug:** (boolean)(optional) Should Debugging be turned on. You can turn on debugging that will display errors encountered by Blunt AJAX. The default value is **false** (actually, the defualt value is set in the php file for this script, but unless you change it there the default is false. Form more information on this see the **Advanced Debugging and Testing** section. Prior to version 1.1.0 debug needed to be the first parameter in arguments. In version 1.1.0 the JS code was changed and it no longer matters what order the debug parameter is included in the arguments list.

**url** (string)(optional) This would be the URL of the path of the server side PHP script that will handle the AJAX request. The defualt value for this argument is the path to the file admin-ajax.php on your site. This is the way you are supposed to handle AJAX requests, you can read more about that in the link I referenced above.

However, I know that not everyone does it this way and it is not always necessary to go through the WordPress AJAX script. I will say that if you are going to access anything about your WordPress site that you should do it properly. Again, when not accessing the WordPress site, for example you're just going to set a SESSION value or something of that nature, you can provide the path to your own script. This path ***MUST*** be on your own server. AJAX only allows connection to the same server that hosts the page it is on and this script ***WILL NOT*** provide access to another server.

**callback** (function)(optional)
A valid callback function to process the server response. The default value of the parameter is the default callback function that is explained below.

**parameters** (object)(optional)
An object containing a list of name/value pairs to be sent with the http request.
**Important Note: See encoding for information on how parameter values are escaped or encoded**
Starting in version 1.1.0 it is possible to pass multidimensional objects and arrays to Blunt Ajax as parameters. Simple Example:
`
  var arguments = {debug:false,
                   url:"/wp-admin/admin-ajax.php",
                   callback: my_callback_function,
                   encoding: 'none',
                   parameters:{action:'action_name',
                               nonce:'12345678',
                               object1: {name1:'value1',
                                         name2:'value2',
                                         name3:['array value 1', 'array value 2', [1,2,4]]},
                               my_parameter:'Some Value"'},
                   method:"GET",
                   element_id:'my-id',
                   pass:'any value type or value'};
  bluntAjax(arguments);
`
As you can see, the parameter value contians objects as well as arrays.

**encoding** (string)(optional)
The encoding method to use for all parameter values. Valid values are "none", "escape" or "uri". The default value for this argument is "none" to maintain backwards compatibility with previous version of Blunt Ajax. Prior to version 1.1.0 no escaping of parameters was done and the user of this script was required to properly escape or encode values before passing to Blunt Ajax.

* none: No escaping or encoding is done. Values are passed to the server exactly as passed to Blunt Ajax.
* escape: Each parameter value is escaped using the JaveScript escape() function, i.e. value = escape(value)
* uri: Each parameter value is encoded using the JavaScript encodeURIComponent() function, i.e. value = encodeURIComponent(value)

If you do a search you'll find plenty of those voicing their opionion about what the proper encoding method is for query parameters. I'm not here to judge. Use the method that works best for you. I think I have included anything you could need.


**method** (string)(optional)
The method that should be used for the HTTP request, either "GET" or "POST". The default value of this argument is "GET". This value is case insensitive.

**element_id** (string)(optional)
A valid element id attribute in your document. This value can be used by the callback function for inserting HTML into the page. Default value is false.

**pass** (any type)(optional)
This argument can be of any type or value. The value of this object is not checked or altered in any way and is simply passed to the callback function.

= Callback Functions =
All AJAX scripts use callback functions. This is a function that processes or acts upon the response recieved from the server. The Blunt AJAX script does not alter the server response in any way, it is up to you to write a callback function for this purpose.

The following is what the default callback function looks like. The default callback function can be used to either show the server's response in a JavaScript alert message or to put it into the inner HTML attribute of an element if an element id was specified when calling the bluntAjax function.

`&lt;script type="text/javascript"&gt;
  function bluntAjaxDefaultCallback(response, element_id, pass) {
    if (element_id !== false) {
      document.getElementById(element_id).innerHTML = response;
    } else {
      // element_id not given alert response
      alert(response);
    }
  }
&lt;/script&gt;`

Notice that the pass parameter is not used, it is simply included in the above function to show you the parameters that are passed to the callback function and the order that they are passed in. You can use the default callback function to simply alert your response or insert it into the page. It is also valuable for debugging purposes.

Once again I want to stress that the server response is not altered in any way. Whatever response your server side action sends is exactly what this parameter will contain. You can send any type of value (i.e. XML, HTML, plain text, JSON), but you must write the callback function to deal with the data. This plugin and the blunt-ajax.js script is for the sole purpose of sending a request and relaying the response.

= Advanced Debugging and Testing =
There are some PHP methods that you can call to do several things:

1. To turn debugging on call the method **bluntAjax::debugOn()**. When debug is turned on the javascript file debug.js in the blunt-ajax plugin folder will be loaded. I use this file, as is probably obvious, for degugging purposes.
2. To automatically run a test call the method **bluntAjax::test()**. This will cause a test to be run that will send an AJAX request. The response of this request will be displayed in a JavaScript alert message. This message will contain the request method used and a list of the paremeters that were sent with the request. When testing is turned on the the file test.js in the blunt-ajax plugin folder will be loaded. I use this to test that everything is working as I expect.
3. To include the full JavaScript version in your page call **bluntAjax::minifiedOff()**. This will cause the un-minified version of the blunt AJAX javascript to be loaded. I don't know why you would want to do this. I do it when I'm making modifications and testing the script before creating the new minified version.

All of these functions must be called on the 'init' action. This is when the blunt-ajax.js file is engueued. My init method has a priority of 100 so your init function must have a lower priority; in most cases the default priority will be sufficient.

**Example of calling degugging and testing function**

*calling all functions together in a function*
`
&lt;?php 
  add_action('init', 'my_init_function');
  function my_init_function() {
    bluntAjax::debugOn();
    bluntAjax::testOn();
    bluntAjax::minifiedOff();
  }
?&gt;
`

*using init action to call funtions*
`&lt;
  $instance = bluntAjax::getInstance();
  add_action('init', array($instance, 'degucOn'));
  add_action('init', array($instance, 'testOn'));
  add_action('init', array($instance, 'minifiedOff'));
&gt;`


== Frequently Asked Questions ==

= Why not just use [insert the name of your favorite JavaScript framework here]? =

I'm a *"use the right tool for the job"* kind of a person. If I need to tighten a screw I use a screwdriver, I don't dig into my toolbox an pull out a widget that'll do 101 different jobs and can handle every type and size screw. 

The same goes for development. Chances are that I'm only going to use a tiny fraction of what some JavaScript framework will do. Chances are also quite good that I can do the job I need done faster and easier with a tool designed to do exactly what I need done. I also want to consider the weight of the tool. Just like I don't want to lug around an entire toolbox with me when I can slip a screwdriver into my pocket, I don't want a website to lug around the weight of that framework when it's not necessary and I ain't gonna use 95% of it.

This plugin is for anyone that thinks the same way I do and does not automatically turn to some framework every time they need to do every little thing; someone that knows how to and prefers to write vanilla JavaScript.

= When should I use Blunt Ajax and when shouldn't I? =

You should use Blunt Ajax when you don't want to use a JavaScript framework. If you are already loading a JavaScript framework that includes AJAX functionality then you should use the AJAX functionality of that framework rather adding Blunt Ajax to the mix. The reason for using this script is to decrease the total size of the JavaScript you use, not to increase it.


== Changelog ==

= 1.1.0 =
* Altered JS so that debug does not need to be first parameter passed in arguments when calling bluntAjax
* Corrected a typo in the message returned by test script
* Added URI encoding or escaping of parameter values (see documentation)
* Added documentation on encoding
* Added the ability to pass multidimensional objects or arrays as parameters (see documentation)
* Added documentation on passing multidimensional objects as parameters
* Refactored JavaScript to reduce code length
* Corrected typos and errors in readme.txt documentation

= 1.0.1 =
* Tested compatability with WP 3.9
* Corrected typos in readme.txt

= 1.0.0 =
* initial release as a WordPress Plugin

== Upgrade Notice ==
