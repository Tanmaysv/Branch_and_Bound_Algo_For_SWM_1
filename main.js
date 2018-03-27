function get_val(){

	localStorage["N"] = document.getElementById("no_of_nodes").value;
	localStorage["url_ip"] = document.getElementById("url_ip").value;

}


function validate(){

	var username = document.forms["val_form"]["username"];
	var password = document.forms["val_form"]["password"];


	if(username.value != "nishant_himath@yahoo.com" || password.value != "141090049"){
		//alert("enter a valid username and password");
		//location.reload();
		if(username.value != "nishant_himath@yahoo.com" && password.value == "141090049"){
			password.style.borderColor = "green";
			username.style.borderColor = "red";
		}else if(username.value == "nishant_himath@yahoo.com" && password.value != "141090049"){
			password.style.borderColor = "red";
			username.style.borderColor = "green";
		}else{
			username.style.borderColor = "red";
			password.style.borderColor = "red";

		}


		return false;
	}
	else{
		//document.getElementById("info").style.display = "block";
		document.getElementById("proceed_btn").style.display = "block";
		username.style.borderColor = "green";
		password.style.borderColor = "green";
		return true;
	}
}
