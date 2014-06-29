var apiVersion = "0.3.2";
var handleSchema = function()
{
	var currentSchema;

	// --

	$( '.autohide' ).hide();

	// ---
	
	var sanitizeOldVersions = 
    function(schema) {
      var message = "Due to updates in our specs, some fields changed and aren't backwards compatible. Please update the following details:\n";
      var counter = 0;
      //changes 0.3.0->0.3.1
      // routing changed from String to Array
      if (  Object.prototype.toString.call(schema.techDetails.routing) !== '[object Array]') {
        schema.techDetails.routing = [];
        counter++;
        message += "Technical Details -> Routing\n";
      }
      // updatemode change from String to Array
      if (  Object.prototype.toString.call(schema.techDetails.updatemode) !== '[object Array]') {
        counter++
        schema.techDetails.updatemode = [];
        message += "Technical Details -> Update Mode\n";
      }
      if ( counter > 0 ) {
        alert(message);
      }
      return schema;
	};
	
  // ---

	var takeJson =
		function() {
			$( '.autohide' ).hide();
			var json = $( '#jsonText' ).val();
			try {
				currentSchema.value = JSON.parse( json );
        currentSchema.value = sanitizeOldVersions(currentSchema.value);
				$('form').empty().jsonForm( currentSchema );
			}
			catch ( e ) {
				console.error( "JSON Syntax Error" );
			}
		};

  // ---

	$( '#jsonTakeButton').bind( 'click', takeJson );

	// ---

	var sortObject = function(map) {
		var keys = _.sortBy(_.keys(map), function(a) { return a; });
		var newmap = {};
		_.each(keys, function(k) {
			newmap[k] = map[k];
		});
		return newmap;
	}

	// ---

	var dirSelect = 
		function() {
			$( '#dirselect' ).append($('<option>').text('choose a community from list'));
			$.getJSON( "php-simple-proxy/ba-simple-proxy.php?url=https://rawgit.com/freifunk/directory.api.freifunk.net/master/directory.json", function(dir) {
				dir.contents = sortObject(dir.contents);
				$.each( dir.contents, function (key, val) {
					$( '#dirselect' )
					.append($('<option>', { value : val })
						.text(key));
				});
			}); 
		};

	// ---

	$( '#dirselect' ).on('change', function() {
		$.getJSON( "php-simple-proxy/ba-simple-proxy.php?url=" + encodeURIComponent(this.value), function(communityJson) {
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

	// finally return the "handleSchema"-function-body
	return function ( schema )
	{
		//console.log(schema);
		schema.form = ffapi.formTemplate;
		schema.form[2].items[1].titleMap = ffapi.isoCountryCodes;
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
				buttonImage: "icon_calendar.svg",
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
