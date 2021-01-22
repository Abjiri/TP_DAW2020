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
    <form class="w3-container modal-content" action="/perfil/${id}/editar/imagem/" method="POST" style="border: 0; width: 100%" enctype="multipart/form-data" >
    <div class="login_img">
        <span class="picture_close" title="Fechar" onclick="fechar()"> &times;</span>
    </div>
    <div "w3-row w3-margin-bottom">
        <div class="w3-col s3">
            <label class="w3-text-teal"><b>Select file(s)</b></label>
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

function editForm(id){
    var form = `
    <form class="w3-container modal-content" action="/perfil/${id}/editar/imagem/" method="POST" style="border: 0; width: 100%" enctype="multipart/form-data" >
    <div class="login_img">
        <span class="picture_close" title="Fechar" onclick="fechar()"> &times;</span>
    </div>
    <div "w3-row w3-margin-bottom">
        <div class="w3-col s3">
            <label class="w3-text-teal"><b>Select file(s)</b></label>
        </div>
        <div class="w3-col s9 w3-border">
            <input class="w3-input w3-border w3-light-grey" onchange="loadFile(event)" type="file" name="foto" accept="image/*" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        </div>
        <img class="w3-margin-top w3-margin-bottom" id="output" style="width:100%"/>
    </div>
    <input class="w3-btn w3-light-blue" type="submit" value="Confirmar" style="width: 100%"/>
</form>
    `
    $('#display2').empty()
    $('#display2').append(form)
    $('#display2').modal()
}