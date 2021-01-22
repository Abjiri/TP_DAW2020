function fechar(){
    document.getElementById('close-modal').click()
}

var loadFile = function(event){
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src)
    }
};

function showEdit(){
    var ficheiro = `<img src='https://bootdey.com/img/Content/avatar/avatar3.png' />`

    $('#display').empty()
    $('#display').append(ficheiro)
    $('#display').modal()
}

function pictureForm(id){
    var form = `
    <form class="w3-container modal-content" action="/perfil/${id}/editar/imagem/" method="POST" style="border: 0; width: 100%">
    <div class="login_img">
        <span class="picture_close" title="Fechar" onclick="fechar()"> &times;</span>
    </div>
    <div "w3-row w3-margin-bottom">
        <div class="w3-col s3">
            <label class="w3-text-teal"><b>Selecionar Imagem: </b></label>
        </div>
        <div class="w3-col s9 w3-border">
            <input class="w3-input w3-border w3-light-grey" onchange="loadFile(event)" type="file" name="foto" accept="image/*" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        </div>
        <img class="w3-margin-top w3-margin-bottom" id="output" style="width:100%"/>
    </div>
    <input class="w3-btn w3-light-blue" type="submit" value="Confirmar" style="width: 100%"/>
</form>
    `
    $('#display').empty()
    $('#display').append(form)
    $('#display').modal()
}

function equalSelect(f1,f2){
    return f1 == f2 
}

function editForm(user){
    var json = JSON.parse(user.replace(/\\/g, "/"))
    var form = ` 
    <form class="w3-container" action="/perfil/${json._id}/editar/" method="POST">
    <div class="w3-row w3-margin-bottom">
        <div class="w3-col s3">
            <label class="w3-text-teal"><b>Nome:</b></label>
        </div>
        <div class="w3-col s9 w3-border">
            <input class="w3-input w3-border w3-light-grey" type="text" name="nome" value="${json.nome}">
        </div>
    </div>
    <div "w3-row w3-margin-bottom">
        <div class="w3-col s3">
            <label class="w3-text-teal"><b>Descrição:</b></label>
        </div>
        <div class="w3-col s9 w3-border">
            <input class="w3-input w3-border w3-light-grey" type="text" name="descricao" value="${json.descricao}">
        </div>
    </div>
    <div "w3-row w3-margin-bottom">
    <div class="w3-col s3  w3-margin-top">
        <label class="w3-text-teal"><b>Estatuto:</b></label>
    </div>
    <div class="w3-col s9 w3-border w3-margin-top">
        <select name="cars" id="estatuto" style="width:100%">
            <option value="estudante" ` + (json.estatuto.tipo == "estudante" ? `selected` : ``)  + `>Estudante</option>
            <option value="docente" ` + (json.estatuto.tipo == "docente" ? `selected` : ``) + `>Docente</option>
            <option value="trabalhador" ` + (json.estatuto.tipo == "trabalhador" ? `selected` : ``) + `>Trabalhador</option>
        </select>
    </div>
    
    </div>
    <input class="w3-margin-top w3-btn w3-light-blue" type="submit" value="Confirmar" style="width: 100%"/>
    </form>`
    $('#display2').empty()
    $('#display2').append(form)
    $('#display2').modal()
}