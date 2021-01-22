function fechar(){
    document.getElementById('close-modal').click()
}

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
            <input class="w3-input w3-border w3-light-grey" type="file" name="foto">
        </div>
    </div>
    <input class="w3-btn w3-blue-grey" type="submit" value="Confirmar" style="margin: 10px"/>
</form>
    `
    $('#display').empty()
    $('#display').append(form)
    $('#display').modal()
}

function showEditForm(){
    
}