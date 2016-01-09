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
		$.mobile.defaultPageTransition = 'none';
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
		var rights = window.localStorage.getItem("rights");
		var profile_pic = window.localStorage.getItem("profile_pic");
		if(userid)
		{
			$.mobile.pageContainer.pagecontainer("change", "#dashboard", { reverse:false,changeHash:false });
			$(document).on('pagebeforeshow', function(e, data) {
				if($.mobile.activePage.is('#home')){
					$.mobile.pageContainer.pagecontainer("change", "#dashboard", { reverse:false,changeHash:false });
				}
			});
			//$('#dashboard').addClass('ui-page-active');
			//$('#home').removeClass('ui-page-active');
		}
		else
		{
			//$('#home').addClass('ui-page-active');
			//$('#dashboard').removeClass('ui-page-active');
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
		
		/*$('#logo-login').click(function(e){
			window.location.href="#dashboard";
		});*///backdoor
		
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
			//$('#home').addClass('ui-page-active');
			//$('#dashboard').removeClass('ui-page-active');
			 alert("You have successfully logged out");
			 navigator.app.exitApp();
		});
		
		$('div#home_content').load(ipaddress+"/index.php/action/load_homepage",function(){
			
		});
		
		$('a.menubtn').click(function(e){
			e.preventDefault();
			e.stopPropagation();
			$('#mypanel').fadeIn().click(function(e){e.stopPropagation();});
			$(document).click(function(e){$('#mypanel').fadeOut();});
			$('#closemenu,#listview a').click(function(e){$('#mypanel').fadeOut();});
	
			profile_pic = window.localStorage.getItem("profile_pic");
			if(profile_pic && $('.profile_picture').length == 0)
			{
				$('#profile_picture').addClass('profile_picture').attr('style',"background:url('"+ipaddress+"/assets/uploads/profile/"+profile_pic+"') no-repeat center center;").height($('#profile_picture').width());
			}
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
		
		$('button#btnsettings').click(
		function(e){
			try{
				$( ".selector" ).loader( "show" );
				userid = window.localStorage.getItem("userid");
				if(userid){
					$.ajax({
						url: ipaddress+'/index.php/action/savechangessettings/'+userid,  //Server script to process data
						type: 'POST',
						// Form data
						data: new FormData($('#form1')[0]),
						error:function(e,s,err){alert(s+' '+err);},
						//Options to tell jQuery not to process data or worry about content-type.
						cache: false,
						contentType: false,
						processData: false
					}).done(function(request){
						if(request!=''){
							
							$('#login_script').html(request);
						}
						$( ".selector" ).loader( "hide" );
					});
				}
			}
			catch(e){alert(e.message);}
		}
		);
    }
};



app.initialize();