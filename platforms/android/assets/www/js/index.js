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
    receivedEvent: function(id) {
	
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