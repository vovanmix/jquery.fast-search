#jQuery plugin to make auto complete search easier


##Setup
To start include jquery, plugin JS file and plugin CSS file:
```
<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
<script type="text/javascript" src="../jquery.fast-search.js"></script>
<link rel="stylesheet" type="text/css" href="../jquery.fast-search.css"/>
```
Create an HTML input element to apply the plugin:
```
<input name="q" placeholder="Search" type="text" id="q" />
```
And initialize the plugin:
```
<script type="text/javascript">
	$(document).ready(function(){
		$('#q').fastSearch({
			url: 'server_response.html'
		});
	});
</script>
```

##Server response
This plugin can work with two types of server response: HTML (default) and JSON.

###HTML
HTML response will be shown right under the input element. You can return any code you like.

###JSON
JSON response will be shown inside the template. Plugin comes with 4 default templates:
* `templateSimple` - simple links
* `templateText` - links with descriptions
* `templateWithImageSimple` - images with links
* `templateWithImage` - images with links and with description
First template is default. You can specify the template with `rowTemplate` parameter, like fastSearch.templateSimple.
Response could be any JSON object or array. Plugin will work with the following format:
```
[
  {
    "text": "text1",
    "link": "link1",
    "comment": "description",
    "image": "http link to image",
    "width":  "width of image to display, in px"
    "height":  "height of image to display, in px"
  },
  {
    "text": "text2",
    "link": "link2",
	"comment": "description",
	"image": "http link to image",
	"width":  "width of image to display, in px"
	"height":  "height of image to display, in px"
  },
  {
    "text": "text3",
    "link": "link3",
	"comment": "description",
	"image": "http link to image",
	"width":  "width of image to display, in px"
	"height":  "height of image to display, in px"
  }
]
```
If you receive the response in the different format, you can process it with 2 callbacks:
* `processResult` will process the root object to return the array of found items
* `processResultRow` will process a single row to the needed format.
```
processResult: function(data){
	...process...
	return data;
},
processResultRow: function(dataRow){
	...process...
	return dataRow;
}
```


##Options
* `url` - string, url to get search result
* `type` - request type, `get` or `post`
* `dataType` - type of received data, `html` or `json`
* `rowTemplate` - template for the row if using `json`, properties of the fastSearch object, like fastSearch.templateSimple, or string with HTML code and placeholders marked like `%text%`
* `onStart` - a callback before search starts, inserted query as a parameter
* `onReady` - a callback after search ends, with generated html as a parameter
* `processResult` - a callback to process the root object to return the array of found items
* `processResultRow` a callback process a single row to the needed format


##Examples
For examples of integration and server response please look in the `demo` directory   