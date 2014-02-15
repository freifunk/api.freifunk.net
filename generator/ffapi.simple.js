var apiVersion = "0.2.1";
var handleSchema = function()
{
	var currentSchema;

	// --

	$( '.autohide' ).hide();

	// ---

	var takeJson =
		function() {
			$( '.autohide' ).hide();
			var json = $( '#jsonText' ).val();
			try {
				currentSchema.value = JSON.parse( json );
				$('form').empty().jsonForm( currentSchema );
			}
			catch ( e ) {
				console.log( "JSON Syntax Error" );
			}
		};

	// ---

	$( '#jsonTakeButton').bind( 'click', takeJson );

	// ---
	
	var dirSelect = 
		function() {
			$( '#dirselect' ).append($('<option>').text('choose a community from list'));
			$.getJSON( "php-simple-proxy/ba-simple-proxy.php?url=https://raw.github.com/freifunk/directory.api.freifunk.net/master/directory.json", function(dir) {
				$.each( dir.contents, function (key, val) {
					$( '#dirselect' )
						.append($('<option>', { value : val })
					        .text(key));
				});
			}); 
		};

	// ---

	$( '#dirselect' ).on('change', function() {
		$.getJSON( "php-simple-proxy/ba-simple-proxy.php?url=" + this.value, function(communityJson) {
			$( '#jsonText' )
				.empty()
				.val(JSON.stringify( communityJson.contents, null, '  '));
				validate();
		});
	});

	// ---

	var showError = function(errors) {
		var errorText = 'Unfortunately there are ' + errors.length + ' errors in your file validated against our API version ' + apiVersion + ': <ul>';
		$.each( errors, function(key, val) {
			var path = val.uri.match(/.*#\/(.*$)/);
			if (RegExp.$1 == "api") { 
				errorText += '<li>' + RegExp.$1 + ' (don\'t care about, we\'ll update it on submit)</li>'; 
			} else {
				errorText +=  '<li>' + RegExp.$1 + '</li>';
			}
		});
		errorText += '</ul> Please review the fields on the left side and submit your file again!';
		$( '#error' ).show();
		$( '#downloadButton' ).attr('disabled', 'disabled');
		$( '#downloadButton' ).attr('title', 'You need a valid JSON to download your file');
		$( '#downloadButton' ).attr('class', 'btn btn-danger');
		$( '#validateButton' ).attr('title', 'There are serious errors within your API file, please correct your file and submit again!');
		$( '#error .message' ).show().html( errorText);
	       	$( 'body' ).scrollTop( 0 );
	};

	// ---
		
	var validate = 
		function() {
			takeJson();
			//var JSV = require("./JSV").JSV;
			var env = JSV.createEnvironment();
			var schema = currentSchema.schema;
			var report = env.validate(currentSchema.value, schema);
			if (report.errors.length === 0) {
				$( '#downloadButton' ).removeAttr('disabled');
				$( '#downloadButton' ).attr('title', 'Download the JSON contents');
				$( '#downloadButton' ).attr('class', 'btn btn-success');
				$( '#validateButton' ).attr('title', 'Your file is clean and ready to be deployed');
	            		$( '#result .message' ).show().text( 'Congrats! Your API file is valid to version ' + apiVersion + ' of our specs.' );
			} else if (report.errors.length === 1 && report.errors[0].schemaUri.match(/properties\/api$/)) {
	            		$( '#result .message' ).show().text( 'Congrats! Your API file is valid to version ' + apiVersion + ' of our specs. We just updated the version and the date of change.' );
		    		var date = new Date();
		    		currentSchema.value.api = apiVersion;
		    		currentSchema.value.state.lastchange = date.toISOString(); 
				$( '#downloadButton' ).removeAttr('disabled');
				$( '#downloadButton' ).attr('title', 'Download the JSON contents');
				$( '#validateButton' ).attr('title', 'There are little problems, but your API file is valid');
				$( '#downloadButton' ).attr('class', 'btn btn-warning');
	            		$( '#jsonText' ).val( JSON.stringify( currentSchema.value, null, '  ' ) );
	            		$( 'body' ).scrollTop( 0 );

			} else {
				showError(report.errors);
			}

		};

	// ---

	$( '#validateButton').bind( 'click', validate);
	
	// ---

	var download =
		function() {
			window.location = "data:application/text,"+ $( '#jsonText' ).val();
		};

	$( '#downloadButton').bind( 'click', download);

	// ---

	var handleSubmit =
		function (errors, values) {
	        $( '.autohide' ).hide();
	        if (! errors ||(errors.length === 1 && errors[0].schemaUri.match(/properties\/api$/))) {
			$( '#downloadButton' ).removeAttr('disabled');
			$( '#downloadButton' ).attr('title', 'Download the JSON contents');
			$( '#downloadButton' ).attr('class', 'btn btn-success');
			$( '#validateButton' ).attr('title', 'Your file is clean and ready to be deployed');
	        	$( '#result .message' ).show().text( 'Hello ' + values.name + '. This is your API file. Place it on a public webserver and add the URL to our directory.' );
			var date = new Date();
			values.api = apiVersion;
			values.state.lastchange = date.toISOString(); 
	        	$( '#jsonText' ).val( JSON.stringify( values, null, '  ' ) );
	        	$( 'body' ).scrollTop( 0 );
	        }
	        else {
			showError(errors);
	        }
	    };

	// ---

	var formTemplate = [
        "name",
        "url",
        {
            "type": "fieldset",
	    "title": "Location",
            "expanded": true,
            "items": [ 
		    "location.city",
		    "location.lat",
		    "location.lon"
		]
        },
        {
            "type": "fieldset",
            "expanded": true,
	    "title": "Contact",
            "items": [ 
		    "contact.email",
		    "contact.phone"
		]
        },
        {
            "type": "button",
	    "onClick": function (evt) {
       		evt.preventDefault();
	        var r = confirm('Do you really want to only submit this simple version?\n\nThe advanced fields are used in several apps, i.e. to aggregate feeds or calendars, show more information on the comunity map, gather statistics data, creating timelines (to be continued). So if you have more pieces of information, please provide them with your API file');
		if (r === true) {
		    $('form').submit();
		}
      	    },
            "title": "OK - generate that simple API file!"
        },
	{
	    "type": "help",
	    "helpvalue": "<br/><div>The previous fields only contain a <strong>very reduced set</strong> of possible data fields. If you already know some details please take a look on the fields below to complete your file.</div><br/>"
	},
	{
	    "type": "fieldset",
	    "title": "Advanced fields...",
	    //"expandable": true,
	    "items" : [
        	"metacommunity",
	        "state.nodes",
		"state.message",
        	{
	            "type": "fieldset",
        	    "title":"Advanced Contacts",
	            "expandable": true,
      			    "items": [
				"contact.jabber",
				"contact.irc",
				"contact.ml",
				"contact.identica",
				"contact.facebook",
				"contact.twitter",
				"contact.googleplus"
			]
	        },
		{
		    "type": "fieldset",
        	    "title":"Location Details",
	            "expandable": true,
      			    "items": [
				"location.address"
			]
	        },
		{
		    "type": "fieldset",
        	    "title":"Services",
	            "expandable": true,
        	    "items": "services"
	        },
        	{
	            "type": "fieldset",
        	    "title":"Timeline",
	            "expandable": true,
        	    "items": "timeline",
	            "onInsert": function (evt, node) {
   					$('a', node.el).click(function () {
      					//alert('Ni!');
      				
	      				setTimeout(function(){
        					addDatepickerToTimeline();	
      					}, 500 );
      				
    				});
			},
	            "onChange": function (evt, node) {
   					$('a', node.el).click(function () {
      					//alert('Ni!');
      					
      					setTimeout(function(){
        					addDatepickerToTimeline();	
	      				}, 500 );
      					
    				});
  			}
	        },
        	{
	            "type": "fieldset",
        	    "title":"Feeds",
	            "expandable": true,
        	    "items": "feeds"
	        },
		{
		    "type": "fieldset",
		    "title":"Node Maps",
		    "expandable": true,
		    "items":"nodeMaps"
		},
        	{
	            "type": "fieldset",
        	    "title":"Technical Details",
	            "expandable": true,
        	    "items": "techDetails"
	        },
		{
		    "key" : "state.lastchange",
		    "type": "hidden"
		},
        	{
	            "key": "api",
        	    "type": "hidden"
	        }
	    ]
	},
        {
            "type": "submit",
            "title": "OK - generate the full API file!"
        }
    ];

	// ---

	// finally return the "handleSchema"-function-body
	return function ( schema )
	{
		console.log(schema);

		schema.form = formTemplate;
		schema.onSubmit = handleSubmit;

		directory = dirSelect();

		$('form').jsonForm( schema );

		currentSchema = schema;
		addDatepickerToTimeline();
	};
}();

$.getJSON( apiVersion + ".json", handleSchema );

function jq( myid ) {
    return "#" + myid.replace( /(:|\.|\[|\])/g, "\\$1" );
}

function addDatepickerToTimeline()
{
	var i = 0;
	while(1)
	{
		var id = "jsonform-0-elt-timeline["+i+"].timestamp";
		var pictureID = id + "-picture";
		if ($(jq(id)).length > 0 )
		{
			$(jq(id)).datepicker({
      			showOn: "button",
      			buttonImage: "./calendar.gif",
      			buttonImageOnly: true,
      			dateFormat: 'yy-mm-dd',
      			// Before read timestamp change to JS Timestamp
      		//	beforeShow: function(input, inst) {
                //	$(this).val(parseInt($(this).val()) * 1000);
                //}	
      		});
      		$(jq(id)).change( function()
    		{
        		// Change JS Timestamp to Unix Timestamp
        		//$(this).val(parseInt($(this).val()) / 1000);
        		$(this).val().toISOString;
			});
		}
		else
			break;
		i++;
	}
}
