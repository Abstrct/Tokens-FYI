


var results = '';

var keywords_base = [];
var keywords_wallets = [];
var keywords_assets = [];
var keywords_exchanges = [];



var test = '';

$(document).ready(function() {

	$('#button_generate').click(function(){

		results = '';


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
		$.getJSON( "data/kewords_wallets.json", function( data ) {
		  keywords_wallets = [];
		  $.each(data.data, function( key, val ) {
		    
		    for(var i = 0; i < val.name.length; i++) {
			    keywords_wallets.push(  val.name[i] );
		    }

		    for(var i = 0; i < val.website.length; i++) {
			    keywords_wallets.push(  val.website[i] );
		    }

		    for(var i = 0; i < val.relevant_files.length; i++) {
			    keywords_wallets.push(  val.relevant_files[i] );
		    }

		   });

		}).done(function(){
			displayResults();
		});

		//Build the Asset keywords from Coincap.io
		$.getJSON( "https://api.coincap.io/v2/assets?limit=50", function( data ) {
		  keywords_assets = [];
		  $.each(data.data, function( key, val ) {
		    
		    if (val.id.toUpperCase() !== val.name.toUpperCase()) {
			    keywords_assets.push(  val.name  );
			    keywords_assets.push(  val.id  );

		    } else {
		    	keywords_assets.push(  val.name  );
		    }

		    if (!(val.symbol == val.id || val.symbol == val.name)) { 
		  	 	keywords_assets.push(  val.symbol  );
			}
		   });

		}).done(function(){
			displayResults();
		});
		    

		//Build the Exchange keywords from Coincap.io
		$.getJSON( "https://api.coincap.io/v2/exchanges", function( data ) {
		  keywords_exchanges = [];
		  $.each(data.data, function( key, val ) {
		    
		    if (val.exchangeId.toUpperCase() !== val.name.toUpperCase()) {
			    keywords_exchanges.push(  val.name  );
			    keywords_exchanges.push(  val.exchangeId  );

		    } else {
		    	keywords_exchanges.push(  val.name  );
		    }

		    keywords_exchanges.push(  val.exchangeUrl  );
		
		   });

		}).done(function(){
			displayResults();
		});


	});

    
    //Used for switching between view modes. 
    $('input[name=result_display_type]').change(function(){ 
	    $('.result_display_type').removeClass('is-primary');
	    $('#results_display_type_' + this.value + '_value').addClass('is-primary');

		displayResults();
	});
	


	// Move the warning message to below the results section
	$('#button_understand').click(function(){

 		$('#top_warning').prop('hidden', true);
    	$('#bottom_warning').prop('hidden',false);
		
	});

});




function displayResults() {
	
	if ($('input[name=result_display_type]:checked').val() == 'List' ) {

		$('#textarea_field').html('');  
		results = '';

		if ($('#terms_base').is(':checked')) {
			for(var i =0; i < keywords_base.length; i++){
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
			}
		}


		if ($('#terms_wallets').is(':checked')) {
			for(var i =0; i < keywords_wallets.length; i++){
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
			}
		}


		if ($('#terms_assets').is(':checked')) {
			for(var i =0; i < keywords_assets.length; i++){
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
			}
		}

		if ($('#terms_exchanges').is(':checked')) {
			for(var i =0; i < keywords_exchanges.length; i++){
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
			}
		}
		//results = keywords_assets.join('\n') + '\n' + keywords_exchanges.join('\n');
		$('#textarea_field').html(results);  
		
	} else if ($('input[name=result_display_type]:checked').val() == 'Table' ) {
		// TODO build table version
		
	} 
		
	 
}


function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}