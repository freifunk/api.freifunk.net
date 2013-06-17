        $.getJSON("0.1.json", function(schema) {
        console.log(schema); // this will show the info it in firebug console
	schema.form = [
	"name",
        "url",
        "state",
        {
                "type": "fieldset",
                "title": "Location",
                "expandable": true,
                "items": "location"
        },
        {
                "type": "fieldset",
                "title": "Contact",
                "expandable": true,
                "items": "contact"
        },
        {
                "type": "fieldset",
                "title": "Events",
                "expandable": true,
                "items": "events"
        },
        {
                "type": "fieldset",
                "title": "Feeds",
                "expandable": true,
                "items": "feeds"
        },
        {
                "type": "fieldset",
                "title": "Technical details",
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
	schema.onSubmit =  function (errors, values) {
          if (errors) {
            $('#res').html('<p>I beg your pardon? '+ JSON.stringify(errors) + '</p>');
          }
          else {
            $('#res').html('Hello ' + values.name + '. This is your API file. Place it on a public webserver and add the URL to our directory.<br/><br/>' +
              (values.age ? '<br/>You are ' + values.age + '.' : '') +
              '<textarea row=\"288\" cols=\"50\" style=\"margin: 0px 0px 10px; width: 100%; height: 500px;\">' + JSON.stringify(values, null, '  ') + '</textarea>');
          }
        };
        $('form').jsonForm(schema);
        });
