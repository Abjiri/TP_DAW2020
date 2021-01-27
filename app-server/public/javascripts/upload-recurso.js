function checkMimetype(type) {
    return Array.prototype.reduce.call(navigator.plugins, function (supported, plugin) {
        return supported || Array.prototype.reduce.call(plugin, function (supported, mime) {
            return supported || mime.type == type;
        }, supported);
    }, false);
};

function showImage(idAuthor, name, type){
    var file;

    if (type == 'image/png' || type == 'image/jpeg' || type == 'image/gif')
        file = '<img src="/fileStore/' + idAuthor + '-' + name + '" width="80%"/>';
    else if (checkMimetype(type))
        file = `<iframe src="/fileStore/${idAuthor}-${name}" width="80%"/>`;
    else 
        file = '<p>' + name + ', ' + type + '<p>';
    
    $('#display_recurso').empty();
    $('#display_recurso').append(file);
    $('#display_recurso').modal();
}

function injectForm() {
    var newFileId = parseInt($('#anotherFile').attr('class')) + 1;
    var tipos = $('#tipos').val()

    //atualizar o id do último ficheiro na class da div onde se inserem os forms extra
    $('#anotherFile').attr('class', newFileId);

    let form = `
        <div id="${newFileId}" style="margin: 20px">
            <input hidden name="checksum${newFileId}" value=""> 
            <hr>

            <input hidden name="nr_visibilidade" value="${newFileId}">

            <div class="login_container">
                <div class="w3-col s3">
                    <label class="w3-text-teal"><b>Ficheiro: </b></label>
                </div>
                <div class="w3-col s9 w3-border">
                    <input class="w3-input w3-border w3-light-grey" type="file" name="recurso" onchange="getChecksum(this,${newFileId})" required>
                </div>
            </div>

            <div class="login_container">
                <div class="w3-col s3">
                    <label class="w3-text-teal"><b>Nome: </b></label>
                </div>
                <div class="w3-col s9 w3-border">
                    <input class="w3-input w3-border w3-light-grey" type="text" name="titulo" required>
                </div>
            </div>

            <div class="login_container">
                <div class="w3-col s3">
                    <label class="w3-text-teal"><b>Descrição: </b></label>
                </div>
                <div class="w3-col s9 w3-border">
                    <input class="w3-input w3-border w3-light-grey" type="text" name="descricao" required>
                </div>
            </div>

            <div class="login_container">
                <div class="w3-col s3">
                    <label class="w3-text-teal"><b>Tipo: </b></label>
                </div>
                <div class="w3-col s9 w3-border">
                    <select id="tipo_recurso${newFileId}" onchange="showNewTypeInput()" class="w3-input w3-border w3-light-grey" name="tipo" required>`

    var splitTipos = tipos.split('"tipo":"')

    for (var i = 1; i < splitTipos.length; i++) {
        var tipo = splitTipos[i].split('"')[0]
        form += `<option value="${tipo}"> ${tipo} </option>`
    }

    form += `           <option value="Outro"> Outro </option>
                    </select>
                </div>
            </div>

            <div id="outro_tipo_recurso${newFileId}" class="login_container" style="display: none">
                <div class="w3-col s3">
                    <label class="w3-text-teal"><b>Outro: </b></label>
                </div>
                <div class="w3-col s9 w3-border">
                    <input class="w3-input w3-border w3-light-grey" type="text" name="outro_tipo">
                </div>
            </div>

            <script>
                function showNewTypeInput() {
                    var value = document.getElementById("tipo_recurso${newFileId}").value
                    var input = document.getElementById("outro_tipo_recurso${newFileId}")

                    if (value == "Outro") input.style.display = "block";
                    else input.style.display = "none";
                }
            </script>

            <div class="login_container">
                <div class="w3-col s3">
                    <label class="w3-text-teal"><b>Data de criação: </b></label>
                </div>
                <div class="w3-col s9 w3-border">
                    <input class="w3-input w3-border w3-light-grey" type="date" name="dataCriacao" required>
                </div>
            </div>

            <div class="w3-row login_container w3-margin-bottom">
                <div class="w3-col s3">
                    <label class="w3-text-teal"><b>Visibilidade: </b></label>
                </div>
                <div class="w3-col s9">
                    <input type="radio" class="w3-input w3-border w3-light-grey" name="visibilidade${newFileId}" value="publico">
                    <label for="publico"> Público </label>
                    <input type="radio" class="w3-input w3-border w3-light-grey" name="visibilidade${newFileId}" value="privado">
                    <label for="privado"> Privado </label>
                </div>
            </div>
            
            <input class="w3-btn w3-blue-grey" type="button" value="Remover" onclick='removeFormChunk(${newFileId})'/>
        </div>`;
        
    $('#anotherFile').append(form);
    $(`#tipo_recurso${newFileId}`).prepend("<option hidden disabled select value></option>").val('');
}

function removeFormChunk(id) {
    $('#'+id).remove();
}