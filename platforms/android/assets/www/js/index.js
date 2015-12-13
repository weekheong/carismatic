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
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
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
		
		$('#btnShareLocation').click(function(e){
			function onSuccess(position) {
				try{
					var element = document.getElementById('geolocation');
						element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
											'Longitude: ' + position.coords.longitude     + '<br />' +
											'<hr />'      + element.innerHTML;
					if(userid)
					{
						$.post('http://42.61.224.110:8080/carismatic/index.php/action/update_position',{userid:userid,position:position},function(request){
							alert(request);
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
				alert('code: '    + error.code    + '\n' +
					  'message: ' + error.message + '\n');
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
		
		$('div#home_content').load("http://42.61.224.110:8080/carismatic/index.php/action/load_homepage",function(){
			
		});
		
        $('button#btnsignup').click(function(e){
			try{
				$.post("http://42.61.224.110:8080/carismatic/index.php/action/adduser",{
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
				$.post("http://42.61.224.110:8080/carismatic/index.php/action/login",{
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