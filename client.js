var signIn = function(){
    displayError('');

    if(validateSignInForm()){
        var form = document.forms['signInForm'];
        var signIn = serverstub.signIn(form['signInEmail'].value,form['signInPassword'].value);

        if(signIn.success){
            sessionStorage.token = signIn.data;
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
        var data = {
            email:form['signUpEmail'].value,
            password:form['signUpPassword'].value,
            firstname:form['sginUpFirstName'].value,
            lastname:form['signUpLastName'].value,
            gender:form['signUpGender'].value,
            city:form['signUpCity'].value,
            country:form['signUpCountry'].value
        };
        var signUp = serverstub.signUp(data);

        if(!signUp.success){
            displayError(signUp.message)
        }
        else{
            serverstub.signIn(data.email,data.password);
            displayView('profileview');
        }
    }
};

var displayError = function(error){
    var errorBox = document.getElementById('errorbox');
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
