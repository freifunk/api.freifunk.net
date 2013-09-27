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
			$.getJSON( "php-simple-proxy/ba-simple-proxy.php?url=https://raw.github.com/freifunk/api.freifunk.net/master/directory/directory.json", function(dir) {
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
			handleSubmit(errors, values);
		};

	// ---

	$( '#validateButton').bind( 'click', validate);
	

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
	        }
	    };

	// ---

	var formTemplate = [
        "name",
        "metacommunity",
        "url",
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
            "title":"Events",
            "expandable": true,
            "items": "events"
        },
        {
            "type": "fieldset",
            "title":"Feeds",
            "expandable": true,
            "items": "feeds"
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
	};
}();

$.getJSON( "0.1.json", handleSchema );
