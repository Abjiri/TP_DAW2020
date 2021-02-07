function fechar(){
    document.getElementById('close-modal').click()
}

function deleteUser(id){
  $.ajax({
    url: '/users/'+id,
    type: 'DELETE',
    success: function(result) {window.location.replace("/home");}
  });
}

var loadFile = function(event){
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src)
    }
};

function pictureForm(id){
    $('#edit_pic_modal').empty()
    var html = `
    <form class="my-modal-content" action="/perfil/${id}/editar/imagem/" method="POST" enctype='multipart/form-data'>
      <h2 style="margin: 10px 20px 20px 20px">Mudar Foto</h2>
      <div class="login_container">
  
        <div class="login_container">
          <div class="w3-col s3">
            <label class="w3-text-teal"><b>Selecionar Imagem: </b></label>
          </div>
          <div class="w3-col s9 w3-border">
            <input class="w3-input w3-border w3-light-grey" onchange="loadFile(event)" type="file" name="foto" accept="image/*" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          </div>
        </div>
        
        <div class="login_container">
            <img class="w3-margin-top w3-margin-bottom" id="output" style="width:100%"/>

        <div class="w3-row login_container w3-margin-bottom">
          <input class="w3-btn w3-blue-grey w3-margin-top" style="float:right" type="submit" value="Submeter"/>
          <input class="w3-btn w3-blue-grey w3-margin-top" id="close_edit_picture" style="float:right; margin-right: 10px" type="button" value="Cancelar"/>
        </div>
      </div>
    </form>`

    $('#edit_pic_modal').append(html)
    document.getElementById('edit_pic_modal').style.display = 'block';

    $("#close_edit_picture").click(function(event) {
        event.preventDefault();
        document.getElementById('edit_pic_modal').style.display='none';   
    })
}

function equalSelect(f1,f2){
    return f1 == f2 
}

function editForm(user){
    $('#edit_profile_modal').empty()
    var json = JSON.parse(user.replace(/\\/g, "/"))
    var html = `
    <form class="my-modal-content" action="/perfil/${json._id}/editar/" method="POST">
      <h2 style="margin: 10px 20px 20px 20px">Editar Perfil</h2>
      <div class="login_container">
  
        <div class="login_container">
          <div class="w3-col s3">
            <label class="w3-text-teal"><b>Nome: </b></label>
          </div>
          <div class="w3-col s9 w3-border">
            <input class="w3-input w3-border w3-light-grey" type="text" name="nome" value="${json.nome}" required>
          </div>
        </div>
  
        <div class="login_container">
          <div class="w3-col s3">
            <label class="w3-text-teal"><b>Descrição: </b></label>
          </div>
          <div class="w3-col s9 w3-border">
            <input class="w3-input w3-border w3-light-grey" type="text" name="descricao" value="${json.descricao}">
          </div>
        </div>
        <div class="login_container">
          <div class="w3-col s3 w3-margin-top">
            <label class="w3-text-teal"><b>Estatuto: </b></label>
          </div>
          <div class="w3-col s9 w3-margin-top">
            <select name="estatuto" id="estatuto" style="width:100%" required>
              <option value="estudante" ` + (json.estatuto.tipo == "estudante" ? `selected` : ``)  + `>Estudante</option>
              <option value="docente" ` + (json.estatuto.tipo == "docente" ? `selected` : ``) + `>Docente</option>
              <option value="trabalhador" ` + (json.estatuto.tipo == "trabalhador" ? `selected` : ``) + `>Trabalhador</option>
            </select>
          </div>
        </div>
        <div class="login_container">
        <div class="w3-col s3 w3-margin-top">
          <label class="w3-text-teal"><b>Filiação: </b></label>
        </div>
        <div class="w3-col s9 ">
            <input class="w3-input w3-margin-top w3-light-grey w3-margin-top w3-border" type="text" name="filiacao" value="${json.estatuto.filiacao}" required>
        </div>
      </div>
        <div class="w3-row login_container w3-margin-bottom">
          <input class="w3-btn w3-blue-grey w3-margin-top" style="float:right" type="submit" value="Submeter"/>
          <input class="w3-btn w3-blue-grey w3-margin-top" id="close_edit_profile" style="float:right; margin-right: 10px" type="button" value="Cancelar"/>
        </div>
      </div>
    </form>`
    
    $('#edit_profile_modal').append(html)
    document.getElementById('edit_profile_modal').style.display = 'block';

    $("#close_edit_profile").click(function(event) {
        event.preventDefault();
        document.getElementById('edit_profile_modal').style.display='none';   
    })
    
}