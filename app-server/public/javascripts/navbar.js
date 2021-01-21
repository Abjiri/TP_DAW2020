$(document).ready(function()
  {
    $("#navbar_login").click(function(event) {
        event.preventDefault();
        document.getElementById('login_modal').style.display='block';   
    });

    $(".login_close").click(function() {
        document.getElementById('login_modal').style.display='none';   
    });

    $(".login_cancelbtn").click(function() {
        document.getElementById('login_modal').style.display='none';   
    });

    $(".login_reveal_pwd").click(function() {
        var type = document.getElementById('login_password').getAttribute("type");
        if (type == 'password') document.getElementById('login_password').setAttribute("type","text");
        else document.getElementById('login_password').setAttribute("type","password");
    });
  });
