/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var ipaddress = "http://42.61.224.110:8080/carismatic";
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
		$('div.ui-loader').remove();
		$(document).on('pageshow', '[data-role="page"]',function(e,data){   
			$('.bg-gradient').height($(window).height()); 
		});
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent();
    },
    receivedEvent: function() {
		
		var userid = window.localStorage.getItem("userid");
		if(userid)
		{
			$('#dashboard').addClass('ui-page-active');
			$('#home').removeClass('ui-page-active');
		}
		else
		{
			$('#home').addClass('ui-page-active');
			$('#dashboard').removeClass('ui-page-active');
		}
		
		$('#btnFindPeople').click(function(e){
		
			userid = window.localStorage.getItem("userid");
			
			if(userid)
			{
				$.post(ipaddress+'/index.php/action/findpeople',{numMeters:$('#numMeters').val(),userid:userid},function(request){
					if(request){
						
						var element = document.getElementById('geolocation2');
						element.innerHTML = request;
					}
				});
			}
		});
		
		$('#logo-login').click(function(e){
			window.location.href="#dashboard";
		});//backdoor
		
		$('#btnShareLocation').click(function(e){
			function onSuccess(position) {
				try{
					//var element = document.getElementById('geolocation');
						//element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
											//'Longitude: ' + position.coords.longitude     + '<br />' +
											//'<hr />'      + element.innerHTML;
					userid = window.localStorage.getItem("userid");
					
					if(userid)
					{
						$.post(ipaddress+'/index.php/action/update_position',{userid:userid,latitude:position.coords.latitude,longitude:position.coords.longitude},function(request){
							if(request){
								var minZoomLevel = 12;

							   var map = new google.maps.Map(document.getElementById('map_canvas'), {
								  zoom: minZoomLevel,
								  center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
								  mapTypeId: google.maps.MapTypeId.ROADMAP
							   });

								var element = document.getElementById('geolocation');
								element.innerHTML = request;
							}
						});
					}
				}
				catch (e)
				{
					alert(e.message);
				}
			}

			// onError Callback receives a PositionError object
			//
			function onError(error) {
				//alert('code: '    + error.code    + '\n' +
					  //'message: ' + error.message + '\n');
				if (error.code == 1)
					alert("You must allow this website to use the Geolocation API to access your position.");
				else if (error.code == 3)
					alert("Unfortunately, your position request timed out.");
				else
					alert("Unfortunately, your position could not be determined.");
			}

			// Options: throw an error if no update is received every 30 seconds.
			//
			try{
				var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 0, timeout: 30000, enableHighAccuracy:true });
			}
			catch(e)
			{
				alert(e.message);
			}
		});
		
		$('#logout').click(function(e){
			window.localStorage.clear();
			$('#home').addClass('ui-page-active');
			$('#dashboard').removeClass('ui-page-active');
		});
		
		$('div#home_content').load(ipaddress+"/index.php/action/load_homepage",function(){
			
		});
		
        $('button#btnsignup').click(function(e){
			try{
				$.post(ipaddress+"/index.php/action/adduser",{
				username:$('#signup_username').val(),
				password:$('#signup_password').val(),
				repassword:$('#signup_repassword').val(),
				email:$('#signup_email').val(),
				rights:$('#signup_accounttype').val()},function(request){
					alert(request);
					if((request.indexOf('sign in') > -1))
					{
						window.history.back();
					}
				});
			}
			catch(e)
			{
				alert(e.message);
			}
			
		});
		
		$('button#btnlogin').click(function(e){
			try{
				$.post(ipaddress+"/index.php/action/login",{
				username:$('#login_username').val(),
				password:$('#login_password').val()
				},function(request){
					$('#login_script').html(request);
				});
			}
			catch(e)
			{
				alert(e.message);
			}
			
		});
    }
};



app.initialize();