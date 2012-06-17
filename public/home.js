window.fbLogin = function() {
    FB.login(window.loginCallback, {scope:"email"});
}

window.loginCallback = function(response) {
    if (response.authResponse) {
        console.log("Success");
        window.token = response.session.accessToken;
    }
}
