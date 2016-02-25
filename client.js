window.onload = function(){
    if( sessionStorage.getItem( "token" ) == null ){
        displayView( 'welcomeView' );
    }
    else{
        displayView( 'profileView' );
    }
};

var displayView = function( view ){

    console.log(view);
    document.getElementById( 'view').innerHTML = document.getElementById( view ).innerHTML;

    if( view = 'profileView' ){
        var active = window.location.hash.substr( 1 );

        if( active != "" ){
            setActiveTab( active );
        }

        loadWall();
    }
    else{
        window.history.pushState( "", document.title, window.location.pathname );
    }
};

var signIn = function(){
    displayError('');

    if(validateSignInForm()){
        var form = document.forms['signInForm'];
        var signIn = serverstub.signIn(form['signInEmail'].value,form['signInPassword'].value);

        if(signIn.success){
            sessionStorage.token = signIn.data;
            refreshWall();
        }
        else{
            displayError(signIn.message);
        }
    }
};

var signUp = function(){
    displayError('');
    if(validateSignUpForm()){
        var form = document.forms['signUpForm'];
        console.log(form);
        var data = {
            email:form['signUpEmail'].value,
            password:form['signUpPassword'].value,
            firstname:form['signUpFirstName'].value,
            familyname:form['signUpFamilyName'].value,
            gender:form['signUpGender'].value,
            city:form['signUpCity'].value,
            country:form['signUpCountry'].value
        };
        var signUp = serverstub.signUp(data);
        console.log(signUp);
        if(!signUp.success){
            console.log(4);
            displayError(signUp.message)
        }
        else{
            console.log(5);
            var signInResponse = serverstub.signIn(data.email,data.password);
            // signInResponse = {success: true/false, message: "whatever", data: {token: sihfuiafueuhiuruahuihauih34646}};
            // Check if response was successful and store token!
            displayView('profileView');
        }
    }
};

var displayError = function( error ){
    var errorBox = document.getElementById('errorBox');
    errorBox.innerHTML = error;

    if( error == '' ){
        errorBox.style.visibility = 'hidden';
    }
    else{
        errorBox.style.visibility = 'visible';
    }
};

var validateSignInForm = function(){
    var password = document.forms['signInForm']['signInPassword'].value;

    if( password.length < 8 ){
        displayError('Password at least 8 character');
        return false;
    }
    return true;
};

var validateSignUpForm = function(){
    var password1 = document.forms['signUpForm']['signUpPassword'].value;
    var password2 = document.forms['signUpForm']['signUpRepeatPassword'].value;

    if( password1.length < 8 ){
        displayError('Password at least 8 character');
        return false;
    }

    if( password1 != password2 ){
        displayError('Passwords not match');
        return false;
    }
    return true;
};

var validatePasswordChange = function(){
    var newPassword = document.forms[ 'changePassword' ][ 'newPassword' ].value;
    var repeatPassword = document.forms[ 'changePassword' ][ 'repeatPassword' ].value;

    if( newPassword.length < 8 ){
        displayError( 'Password at least 8 character' );
        return false;
    }

    if( newPassword != repeatPassword ){
        displayError( 'Passwords not match' );
        return false;
    }
    return true;
};

var changePassword = function(){
    displayError('');

    if( validatePasswordChange() ){
        var change = serverstub.changePassword(
            sessionStorage.token,
            document.forms[ 'changePassword' ][ 'oldPassword'].value,
            document.forms[ 'changePassword' ][ 'newPassword'].value
        );
        if( !change.success){
            displayError( change.message );
        }
        else{
            displayView( 'profileView' );
            displayError( change.message );
        }
    }
};

var setActiveTab = function( tab ){
    document.getElementsByClassName( 'linkActive' )[ 0 ].className = "";
    document.getElementById( 'link' + tab ).className = "linkActive";
    var tabs = document.getElementsByClassName( 'tab' );
    for( i = 0; i < tab.length; i++ ){
        tabs[ i ].className = "tab";
    }
    document.getElementById( 'tab' + tab ).className = " tabActive ";
};

var signOut = function(){
    var out = serverstub.signOut( sessionStorage.token );

    if( out.success ){
        delete sessionStorage.token;
        displayView( 'welcomeView' );
    }
    else{
        displayError( out.message );
    }
};

var loadWall = function(){
    var getUser = serverstub.getUserMessagesByToken( sessionStorage.token );

    if( getUser.success ){
        var data = getUser.data;
        document.getElementById( 'infoEmail').innerHTML = data.email;
        document.getElementById( 'infoFirstName').innerHTML = data.firstname;
        document.getElementById( 'infoLastName').innerHTML = data.lastname;
        document.getElementById( 'infoGender').innerHTML = data.gender;
        document.getElementById( 'infoCity').innerHTML = data.city;
        document.getElementById( 'infoCountry').innerHTML = data.country;
        var action = serverstub.getUserMessagesByToken( sessionStorage.token );
        if( action.success ){
            for( i = 0; i < action.data.length; i++ ) {
                document.getElementById('wallPost').innerHTML += '<div class = "wallPost"><h3>Post by'
                + action.data[i].writer + '</h3></p>' + action.data[i].content + '</p></div>';
            }
        }
        else{
                displayError( action.message );
        }
    }
};

var postToWall = function(){
    var token = sessionStorage.token;
    var email = serverstub.getUserDataByToken( token).data.email;
    var post = document.getElementById( 'postContent').value;
    var action = serverstub.postMessage( token, post, email );
    if( action.success ){
        refreshWall();
    }
    else{
        displayError( action.message );
    }
};

var refreshWall = function(){
    displayView( 'profileView' );
};

var searchProfile = function(){
    //displayError( '' );
    var action = serverstub.getUserMessagesByEmail(
        sessionStorage.token, document.forms[ 'searchForm' ][ 'profileSearch'].value );
    if( action.success ){
        var data = action.data;
        document.getElementById( 'browseProfile').style.display = 'block';
        document.getElementById( 'browseEmail').innerHTML = data.email;
        document.getElementById( 'infoFirstName').innerHTML = data.firstname;
        document.getElementById( 'infoLastName').innerHTML = data.lastname;
        document.getElementById( 'infoGender').innerHTML = data.gender;
        document.getElementById( 'infoCity').innerHTML = data.city;
        document.getElementById( 'infoCountry').innerHTML = data.country;
    }
    else{
        displayError( action.message );
        document.getElementById( 'browseProfile').style.display = 'none';
    }
};
