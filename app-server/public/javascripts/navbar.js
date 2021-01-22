$(document).ready(function()
  {
    $("#navbar_login").click(function(event) {
        event.preventDefault();
        document.getElementById('login_modal').style.display='block';   
    });

    $("#navbar_signup").click(function(event) {
        event.preventDefault();
        document.getElementById('signup_modal').style.display='block';   
    });

    $(".login_close").click(function() {
        document.getElementById('login_modal').style.display='none';   
    });

    $(".signup_close").click(function() {
        document.getElementById('signup_modal').style.display='none';   
    });

    $("#login_cancelbtn").click(function() {
        document.getElementById('login_modal').style.display='none';   
    });

    $("#signup_cancelbtn").click(function() {
        document.getElementById('signup_modal').style.display='none';   
    });

    $("#login_reveal_pwd").click(function() {
        var pwd = document.getElementById('login_password');
        if (pwd.getAttribute("type") == 'password') pwd.setAttribute("type","text");
        else pwd.setAttribute("type","password");
    });

    $("#signup_reveal_pwd").click(function() {
        var pwd = document.getElementById('signup_password');
        if (pwd.getAttribute("type") == 'password') pwd.setAttribute("type","text");
        else pwd.setAttribute("type","password");
    });

    $("#signup_reveal_pwd_again").click(function() {
        var pwd = document.getElementById('signup_password_again');
        if (pwd.getAttribute("type") == 'password') pwd.setAttribute("type","text");
        else pwd.setAttribute("type","password");
    });
  });
