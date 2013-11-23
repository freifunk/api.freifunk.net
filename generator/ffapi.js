var handleSchema = function()
{
	var currentSchema;

	// --

	$( '.autohide' ).hide();

	// ---

	var showError =
		function ( title, message ) {
			$( '#error' ).show();
			$( '#error .message' ).text( title );
			$( '#error .details' ).text( message );
		};

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
				showError( "JSON Syntax Error", e );
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
		});
	});

	// ---
	
	var validate = 
		function(errors, values) {
			takeJson();
			handleSubmit();
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
	        if (errors) {
	            showError( 'I beg your pardon?', JSON.stringify( errors ) );
	        }
	        else {
	            $( '#result .message' ).show().text( 'Hello ' + values.name + '. This is your API file. Place it on a public webserver and add the URL to our directory.' );
	            $( '#jsonText' ).val( JSON.stringify( values, null, '  ' ) );
	            $( 'body' ).scrollTop( 0 );
	        }
	    };

	// ---

	var formTemplate = [
        "name",
        "metacommunity",
        "url",
	"events",
        "state",
        {
            "type": "fieldset",
            "expanded": true,
            "items": "location"
        },
        {
            "type": "fieldset",
            "title":"Contact (one required)",
            "expandable": true,
            "items": "contact"
        },
        {
            "type": "fieldset",
            "title":"Timeline",
            "expandable": true,
            "items": "timeline",
            onInsert: function (evt, node) {
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
            "key": "api",
            "type": "hidden"
        },
        {
            "type": "submit",
            "title": "OK - give it to me!"
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
		addPictureForDateTrigger("jsonform-0-elt-state.lastchange");
		addDatepickerToTimeline();
	};
}();

$.getJSON( "0.2.0.json", handleSchema );


function jq( myid ) {
    return "#" + myid.replace( /(:|\.|\[|\])/g, "\\$1" );
}

function addPictureForDateTrigger(id)
{
	var pictureID = id + "-picture";
	$(jq(id)).after('<img id="' + pictureID + '" src="./calendar.gif">');
	
	$(jq(pictureID)).click(function() {
		var date = new Date();
		$(jq(id)).val(parseInt(date.getTime()/1000));
	});
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
      			dateFormat: '@',
      			// Before read Timestamp change to JS Timestamp
      			beforeShow: function(input, inst) {
                	$(this).val(parseInt($(this).val()) * 1000);
                }	
      		});
      		$(jq(id)).change( function()
    		{
        		// Change JS Timestamp to Unix Timestamp
        		$(this).val(parseInt($(this).val()) / 1000);
			});
		}
		else
			break;
		i++;
	}
}