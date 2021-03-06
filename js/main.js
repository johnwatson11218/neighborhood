   $( document ).ready(  function(){

      	$('#list-view-open').click( function(){
      			var listView = $('#list-view');
      			if( listView.css( 'display')  === 'none'){
      				listView.css( 'display', 'block');
      			} else {
					listView.css( 'display', 'none');
      			}

      		});

		var map;
      	if( typeof google != "undefined" ){
      		map = new google.maps.Map(document.getElementById('map-canvas'), {center: new google.maps.LatLng(33.5, -112.11),zoom: 12 });
      	}


      	if( typeof map == 'undefined' ){
      		$('#error-msg').css( 'display', 'block');
      		$('#map-canvas').css( 'display', 'none');
      		return;
      	}

		var markerInfo = [
			{
				latLng : new google.maps.LatLng(33.5105393352139 , -112.028618823315 	),
				title : "Apple Store",
				infoText : 'The Apple Store<br>2502 E Camelback Rd<br>(602) 606-1470',
				venueId : "4a3d9447f964a52077a21fe3",
				keys : [ 'computer', 'apple', 'biltmore']
			},
			{
				latLng : new google.maps.LatLng(33.57084159984521, -112.06561795215607),
				title : "Los Reyes de la Torta",
				infoText : 'Mexico City style sandwich shop<br>9230 N 7th St<br>(602) 870-2967',
				venueId : "4b61dfacf964a52069282ae3",
				keys : [ 'mexican', 'food']
			},
			{

				latLng : new google.maps.LatLng( 33.47016494688462,  -112.06533268014412 ),
				title : "Green Restaurant",
				infoText : 'Vegan Food.<br> 2022 N 7th St<br>(602) 258-1870',
				venueId : "4e8a0dc45c5c370ff4894f15",
				keys : [ 'vegan', 'food']
			},
			{

				latLng : new google.maps.LatLng( 33.49749976025891, -112.08386364950333 ),
				title : "Copper Star Coffee",
				infoText : 'local coffee shop<br>4220 N 7th Ave<br>(602) 266-2136',
				venueId : "4a57f364f964a52021b71fe3",
				keys : [ 'coffee']
			},
			{

				latLng : new google.maps.LatLng(  33.581339203011716,  -112.1181889383759),
				title : "Olive Garden",
				infoText : 'National Chain Restaurant<br>2710 W North Ln<br>(602) 943-1502',
				venueId : "4b4e8298f964a5200ff026e3",
				keys : [ 'italian', 'food']
			},
			{
				latLng : new google.maps.LatLng( 33.5004692924433, -112.07405313849449),
				title : "Lux Coffee",
				infoText : 'local coffee shop<br>4402 N Central Ave<br>(602) 327-1396',
				venueId : "414b7a80f964a520d01c1fe3",
				keys : [ 'coffee']

			},
			{
				latLng : new google.maps.LatLng( 33.5545746784533, -112.10102140903473),
				title : "Sprouts",
				infoText : 'organic grocery store<br>8040 N 19th Ave<br>(602) 864-6130',
				venueId : "4aa54800f964a520d64720e3",
				keys : [ 'organic', 'grocery']

			},
			{
				latLng : new google.maps.LatLng(  33.50974700422365, -112.03650840118495),
				title : "Half Price Books",
				infoText : 'half price books<br>2102 E Camelback Rd<br>(602) 954-4653',
				venueId : "4bb55b70941ad13a1b2d1ee3",
				keys : [ 'books']

			},
			{
				latLng : new google.maps.LatLng( 33.510860989324634, -112.08319996026215),
				title : "LA Fitness",
				infoText : 'LA Fitness<br>710 W Camelback Rd<br>(602) 282-0243',
				venueId : "50e2180de4b0a2f21aee7c05",
				keys : [ 'gym']

			},
			{
				latLng : new google.maps.LatLng( 33.524002292918325, -112.04780876720213),
				title : "Luci's Healthy Marketplace",
				infoText : 'Healthy Marketplace<br> 1590 Bethany Home Rd<br>(602) 773-1339',
				venueId : "4acb5a15f964a52089c320e3",
				keys : [ 'grocery', 'food']

			}


		];



		var clientId = "BQGC5WNEA0R1OCNX5OS5K3Q0WLGQ5OSJQAICSYNCHQ5TULJN";
		var clientSecret = "HUOXP5ZINAHDEH2EHGZLM0ZH0E0XSZN3CYQMMBIP0MAVYXRP";


      	//
      	// start of the knockout init code
      	//
      	function DecoratedMarker( marker_info, mvm ){
      		var self = this;


      		self.mvm = mvm;
      		self.title = marker_info.title;
      		self.venueId = marker_info.venueId;


			self.bubbleText  = ko.observable( marker_info.infoText);

      		self.keys = marker_info.keys;
      		// take the bubbe text and the title and split them into words and add them to the list of keys
      		// so that the search will include that text as well
      		var bubbleParts = self.bubbleText().split( " ");
      		for( var i = 0 ; i < bubbleParts.length; i++ ) self.keys.push( bubbleParts[i].toLowerCase() );
      		var titleParts = self.title.split( " " );
      		for( i = 0; i < titleParts.length; i++ ) self.keys.push( titleParts[i].toLowerCase());


      		self.infowindow = new google.maps.InfoWindow( { content : self.bubbleText() });

      		self.mapMarker = new google.maps.Marker({ position: marker_info.latLng,map: map,title: marker_info.title });


      		// This function is called when one of the markers on the map is clicked
      		google.maps.event.addListener( self.mapMarker , 'click',  function(){
      			self.selected();
      		});

      		// This function is called when one of the list items is clicked from list view
      		self.selected = function(){
      			// close any other bubble, and unselect any other label
      			mvm.closeAll();
      			self.clicked();

      			$('#four-square-view').css( 'display', 'block');

				var foursquareUrl = 'https://api.foursquare.com/v2/venues/' + self.venueId + '?v=20130815&' + 'client_id=' + clientId + '&client_secret=' + clientSecret;
				mvm.fourName( 'waiting');
      			mvm.fourRating( 'waiting');
				 $.ajax( { url : foursquareUrl }).done(
						function ( response) {
							var v = response.response.venue;
							mvm.fourName( v.name);
			      			mvm.fourRating( v.rating);
					}).error( function () {
							mvm.fourName( 'error' );
							mvm.fourRating( 'error');
						}
					);
      		};


      		self.matches = function( q ){
      			// see if query 'q' appears in the keys
      			return $.inArray( q.toLowerCase(), self.keys ) != -1;
      		};



      		/*
				 The states are the following
				1) initial map load. All labels are visible and unselected. All markers are visible and their baloon is up
				2) marker clicked. Only that label will have 'selected' css class and the bubble is visible, also the 4square should be up.
				3) matches a search, same as 2) above but w/o the 4square ( currently is coming off the list view which is odd )
				4) does not match a search result, label and marker are not visible.
      		*/

      		// this var is used to control the css class for the list item
      		self.isHidden = ko.observable( false );

      		self.initialState = function(){
      			self.isHidden( false );
      			self.mapMarker.setVisible( true );
      			self.infowindow.close();
      			$('#four-square-view').css( 'display', 'none');
      		};

      		self.clicked = function(){
      			self.isHidden( false );
      			self.mapMarker.setVisible( true );
      			self.infowindow.open( map,self.mapMarker );
      		};

      		self.matchesSearch = function(){
      			self.isHidden( false );
      			self.mapMarker.setVisible( true );
      			self.infowindow.open( map,self.mapMarker );
      			$('#four-square-view').css( 'display', 'none');
      		};

      		self.doesNotMatch = function(){
      			self.isHidden( true );
      			self.mapMarker.setVisible( false );
      			self.infowindow.close();
      			$('#four-square-view').css( 'display', 'none');
      		};


      	}

      	function MarkerViewModel(){
      		var self = this;

      		var tmpArray = [];
      		for( var i = 0; i < markerInfo.length; i++ ) tmpArray.push( new DecoratedMarker( markerInfo[i], self) );
      		self.markers = ko.observableArray( tmpArray );





      		self.fourName = ko.observable('inital');
      		self.fourRating = ko.observable( 'initial');
      		self.searchQ = ko.observable( '' );


      		self.closeAll = function( ){ for( var i = 0; i < self.markers().length; i++ ) self.markers()[i].initialState(); };
      		self.searchMarkers = function(){

      			var q = self.searchQ();

      			// find a list of markers that match this string
      			var filterList = [];
      			var noMatchList = [];
      			for( var i = 0; i < self.markers().length; i++ ){
      				var m = self.markers()[i];
      				if( m.matches( q ))
      					filterList.push( m );
      				else
      					noMatchList.push( m);
      			}

      			for(  i = 0; i < filterList.length; i++ )filterList[i].matchesSearch();
      			for(  i = 0; i < noMatchList.length; i++ )noMatchList[i].doesNotMatch();


      		};

      		self.selectItem = function( item ){
      			item.selected();
      		};


      		self.clearSearch = function(){
      			self.searchQ("");
      			for(  i = 0; i < self.markers().length; i++ ) self.markers()[i].initialState();
      		};
      	}

        ko.applyBindings( new MarkerViewModel() );

      });