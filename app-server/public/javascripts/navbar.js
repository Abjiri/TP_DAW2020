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

    $("#recurso_preview").click(function() {
        document.getElementById('recurso_modal').style.display='block';   
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

    $("#tipo_estatuto_signup").change(function() {
        var tipo = $(this).val();
        var filiacao = document.getElementById('filiacao');

        switch (tipo) {
            case "estudante": filiacao.setAttribute("placeholder","Curso..."); break;
            case "docente": filiacao.setAttribute("placeholder","Departamento..."); break;
            case "trabalhador": filiacao.setAttribute("placeholder","Empresa..."); break;
        }
    });

    $('select').change(function() {
        if (this.id.match(/tipo_recurso[0-9]+/)) {
            let nr = this.id.split('tipo_recurso')[1]

            if ($(this).val() == "Outro") $(`#outro_tipo_recurso${nr}`).show()
            else $(`#outro_tipo_recurso${nr}`).hide()
        }
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

    $("#new_resource").click(function(event) {
        event.preventDefault();
        document.getElementById('new_resource_modal').style.display='block';   
    });

    $("#close_new_resource").click(function(event) {
        event.preventDefault();
        document.getElementById('new_resource_modal').style.display='none';   
    });

    $(".download_recurso").click(function() {
        location.reload() 
    });

    $('#noticia-Privado-Atualizado').click(function(e) {
        e.preventDefault()
        window.alert('Este recurso já não se encontra disponível!')
    })

    $('#noticia-Privado-Novo').click(function(e) {
        e.preventDefault()
        window.alert('Este recurso já não se encontra disponível!')
    })

    $('#noticia-Eliminado-Atualizado').click(function(e) {
        e.preventDefault()
        window.alert('Este recurso já não se encontra disponível!')
    })

    $('#noticia-Eliminado-Novo').click(function(e) {
        e.preventDefault()
        window.alert('Este recurso já não se encontra disponível!')
    })

    $('.footer_home').click(function(e) {
        e.preventDefault()
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    })
  });
