


var results = '';

var keywords_base = [];
var keywords_wallets = [];
var keywords_assets = [];
var keywords_exchanges = [];
var keywords_addresses = [];
var keywords_noise = [];

var colours = Array('Default','Black','Dark red','Dark green','Dark yellow','Dark blue','Dark magenta','Dark cyan','Light gray','Gray','Red','Green','Yellow','Blue','Magenta','Cyan','White');

var test = '';

$(document).ready(function() {

	$('#button_generate').click(function(){

		results = '';

		//Build the Wallet Keywords
		$.getJSON( "data/keywords_noise.json", function( data ) {
		  keywords_noise = [];
		  for (var i = 0; i < data.length; i++){
		    keywords_noise.push(  data[i].toUpperCase() );
		  }

		}).done(function(){
			displayResults();
		});


		//Build the Based Keywords
		$.getJSON( "data/keywords_base.json", function( data ) {
		  keywords_base = [];
		  for (var i = 0; i < data.length; i++){
		  	 	keywords_base.push(  data[i] );
		  }
		}).done(function(){
			displayResults();
		});

		//Build the Wallet Keywords
		$.getJSON( "data/keywords_wallets.json", function( data ) {
		  keywords_wallets = [];
		  $.each(data.data, function( key, val ) {
		    
		    if ($('#terms_wallets_options_names').is(':checked') ) {
			    for(var i = 0; i < val.name.length; i++) {
				    keywords_wallets.push(  val.name[i] );
			    }
			}

			if ($('#terms_wallets_options_websites').is(':checked') ) {
			    for(var i = 0; i < val.website.length; i++) {
				    keywords_wallets.push(  val.website[i] );
			    }
			}

			if ($('#terms_wallets_options_files').is(':checked') ) {
		   		for(var i = 0; i < val.relevant_files.length; i++) {
			    	keywords_wallets.push(  val.relevant_files[i] );
		    	}
		    }
		   });

		}).done(function(){
			displayResults();
		});

		//Build the Addresses Regular Expressions
		$.getJSON( "data/keywords_addresses.json", function( data ) {
		  keywords_addresses = [];
		  for (var i = 0; i < data.length; i++){
		  	 	keywords_addresses.push(  data[i] );
		  }
		}).done(function(){
			displayResults();
		});

		//Build the Asset keywords from Coincap.io
		$.getJSON( "https://api.coincap.io/v2/assets?limit="+ $('#terms_assets_options_max').val(), function( data ) {
		  keywords_assets = [];
		  $.each(data.data, function( key, val ) {
		   
		   if ($('#terms_assets_options_names').is(':checked') && $('#terms_assets_options_ticker').is(':checked')) {
			    if (val.id.replace("-","").toUpperCase() != val.name.toUpperCase()) {
				    keywords_assets.push(  val.name  );
				    keywords_assets.push(  val.id.replace("-","")  );

			    } else {
			    	keywords_assets.push(  val.name  );
			    }

			    if (!(val.symbol.toUpperCase() == val.id.replace("-","").toUpperCase() || val.symbol.toUpperCase() == val.name.toUpperCase())) { 
			  	 	keywords_assets.push(  val.symbol  );
				}

			} else if ($('#terms_assets_options_names').is(':checked') ) {
			    if (val.id.replace("-","").toUpperCase() != val.name.toUpperCase()) {
				    keywords_assets.push(  val.name  );
				    keywords_assets.push(  val.id.replace("-","")  );

			    } else {
			    	keywords_assets.push(  val.name  );
			    }
			} else if ($('#terms_assets_options_ticker').is(':checked')) {
				keywords_assets.push(  val.symbol  );
			}

		   });

		}).done(function(){
			displayResults();
		});
		    

		//Build the Exchange keywords from Coincap.io
		$.getJSON( "https://api.coincap.io/v2/exchanges?limit="+ $('#terms_assets_options_max').val(), function( data ) {
		  keywords_exchanges = [];
		  $.each(data.data, function( key, val ) {
		    
		    if ($('#terms_exchanges_options_names').is(':checked') ) {
			    if (val.exchangeId.toUpperCase() !== val.name.replace("-"," ").toUpperCase()) {
				    keywords_exchanges.push(  val.name.replace("-"," ")  );
				    keywords_exchanges.push(  val.exchangeId  );

			    } else {
			    	keywords_exchanges.push(  val.name.replace("-"," ")  );
			    }
			}

			if ($('#terms_exchanges_options_websites').is(':checked') ) {
		    	keywords_exchanges.push(  val.exchangeUrl  );
		    }
		
		   });

		}).done(function(){
			displayResults();
		});


	});

	$('#terms_assets').change(function(){
		if($('#terms_assets').is(':checked')){
    		$('#term_assets_options_container').prop('hidden', false);
		} else {
			$('#term_assets_options_container').prop('hidden', true);
		}
    });


	$('#terms_exchanges').change(function(){
		if($('#terms_exchanges').is(':checked')){
    		$('#term_exchanges_options_container').prop('hidden', false);
		} else {
			$('#term_exchanges_options_container').prop('hidden', true);
		}
    });

	$('#terms_wallets').change(function(){
		if($('#terms_wallets').is(':checked')){
    		$('#term_wallets_options_container').prop('hidden', false);
		} else {
			$('#term_wallets_options_container').prop('hidden', true);
		}
    });

    //Used for switching between view modes. 
    $('input[name=result_display_type]').change(function(){ 
	    $('.result_display_type').removeClass('is-primary');
	    $('#results_display_type_' + this.value + '_value').addClass('is-primary');

	    if (this.value == "List") {
	     	$('#results_table').prop('hidden', true);
    		$('#results_text').prop('hidden', false);
    	} else {
	     	$('#results_table').prop('hidden', false);
    		$('#results_text').prop('hidden', true);
    	}
		displayResults();
	});
	


	// Move the warning message to below the results section
	$('#button_understand').click(function(){

 		$('#top_warning').prop('hidden', true);
    	$('#bottom_warning').prop('hidden',false);
		
	});


	$('#copy_results').click(function(){

	
		if ($('input[name=result_display_type]:checked').val() == "List") {
	 		$('#textarea_field').select();
	  		document.execCommand("copy");
		} else {

		    $('#results_table').prop('hidden', true);
	    	$('#results_text').prop('hidden', false);
	 		$('#textarea_field').select();
	  		document.execCommand("copy");
	  		$('#results_table').prop('hidden', false);
	    	$('#results_text').prop('hidden', true);
    	}
		
	});

});




function displayResults() {
	
	results = '';
	$('#keywords_table').find("tbody").html('');  

	if ($('#terms_base').is(':checked')) {
		for(var i =0; i < keywords_base.length; i++){
			if ($('#terms_noise').is(':checked')) {
				if(keywords_noise.includes(keywords_base[i].toUpperCase())){
					continue;
				}
			}

			if (
					(
						$('#colour_background').val() != '' 
						&& $('#colour_background').val() != null 
					)
					|| 
					(
						$('#colour_text').val() != ''
						&& $('#colour_text').val() != null
					)
				) {
				results += ($('#colour_background').val() != null && $('#colour_background').val() != '')? $('#colour_background').val() +';' : 0 +';';
				results += ($('#colour_text').val() != null && $('#colour_text').val() != '')? $('#colour_text').val() +';' : 0 +';';
			}

			if (keywords_base[i].indexOf(' ') > -1)
			{
				results += '"' + keywords_base[i] + '"' + '\n';
			} else {
				results += keywords_base[i] + '\n';
			}

			$('#keywords_table').find("tbody").append('<tr><td>' + keywords_base[i] + '</td><td>' + ' General ' + '</td></tr>');

		}
	}


	if ($('#terms_wallets').is(':checked')) {
		for(var i =0; i < keywords_wallets.length; i++){
			if ($('#terms_noise').is(':checked')) {
				if(keywords_noise.includes(keywords_wallets[i].toUpperCase())){
					continue;
				}
			}

			if (
					(
						$('#colour_background').val() != '' 
						&& $('#colour_background').val() != null 
					)
					|| 
					(
						$('#colour_text').val() != ''
						&& $('#colour_text').val() != null
					)
				) {
				results += ($('#colour_background').val() != null && $('#colour_background').val() != '')? $('#colour_background').val() +';' : 0 +';';
				results += ($('#colour_text').val() != null && $('#colour_text').val() != '')? $('#colour_text').val() +';' : 0 +';';
			}

			if (keywords_wallets[i].indexOf(' ') > -1)
			{
				results += '"' + keywords_wallets[i] + '"' + '\n';
			} else {
				results += keywords_wallets[i] + '\n';
			}

			$('#keywords_table').find("tbody").append('<tr><td>' + keywords_wallets[i] + '</td><td>' + ' Wallets' + '</td></tr>');
		}
	}


	if ($('#terms_assets').is(':checked')) {
		for(var i =0; i < keywords_assets.length; i++){

			if ($('#terms_noise').is(':checked')) {
				if(keywords_noise.includes(keywords_assets[i].toUpperCase())){
					continue;
				}
			}

			if (
					(
						$('#colour_background').val() != '' 
						&& $('#colour_background').val() != null 
					)
					|| 
					(
						$('#colour_text').val() != ''
						&& $('#colour_text').val() != null
					)
				) {
				results += ($('#colour_background').val() != null && $('#colour_background').val() != '')? $('#colour_background').val() +';' : 0 +';';
				results += ($('#colour_text').val() != null && $('#colour_text').val() != '')? $('#colour_text').val() +';' : 0 +';';
			}
			
			if (keywords_assets[i].indexOf(' ') > -1)
			{
				results += '"' + keywords_assets[i] + '"' + '\n';
			} else {
				results += keywords_assets[i] + '\n';
			}

			$('#keywords_table').find("tbody").append('<tr><td>' + keywords_assets[i] + '</td><td>' + ' Assets ' + '</td></tr>');
		}
	}

	if ($('#terms_exchanges').is(':checked')) {
		for(var i =0; i < keywords_exchanges.length; i++){
			if ($('#terms_noise').is(':checked')) {
				if(keywords_noise.includes(keywords_exchanges[i].toUpperCase())){
					continue;
				}
			}

			if (
					(
						$('#colour_background').val() != '' 
						&& $('#colour_background').val() != null 
					)
					|| 
					(
						$('#colour_text').val() != ''
						&& $('#colour_text').val() != null
					)
				) {
				results += ($('#colour_background').val() != null && $('#colour_background').val() != '')? $('#colour_background').val() +';' : 0 +';';
				results += ($('#colour_text').val() != null && $('#colour_text').val() != '')? $('#colour_text').val() +';' : 0 +';';
			}
			if (keywords_exchanges[i].indexOf(' ') > -1)
			{
				results += '"' + keywords_exchanges[i] + '"' + '\n';
			} else {
				results += keywords_exchanges[i] + '\n';
			}

			$('#keywords_table').find("tbody").append('<tr><td>' + keywords_exchanges[i] + '</td><td>' + ' Exchanges ' + '</td></tr>');

		}
	}


	if ($('#terms_addresses').is(':checked')) {
		for(var i =0; i < keywords_addresses.length; i++){
			if (
					(
						$('#colour_background').val() != '' 
						&& $('#colour_background').val() != null 
					)
					|| 
					(
						$('#colour_text').val() != ''
						&& $('#colour_text').val() != null
					)
				) {
				results += ($('#colour_background').val() != null && $('#colour_background').val() != '')? $('#colour_background').val() +';' : 0 +';';
				results += ($('#colour_text').val() != null && $('#colour_text').val() != '')? $('#colour_text').val() +';' : 0 +';';
			}

			results += '"' + keywords_addresses[i] + '"' + '\n';

			$('#keywords_table').find("tbody").append('<tr><td>' + keywords_addresses[i] + '</td><td>' + ' Addresses ' + '</td></tr>');

		}
	}

	//results = keywords_assets.join('\n') + '\n' + keywords_exchanges.join('\n');
	$('#textarea_field').html(results);  
		
	 
}


function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}