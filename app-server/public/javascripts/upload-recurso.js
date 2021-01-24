function checkMimetype(type) {
    return Array.prototype.reduce.call(navigator.plugins, function (supported, plugin) {
        return supported || Array.prototype.reduce.call(plugin, function (supported, mime) {
            return supported || mime.type == type;
        }, supported);
    }, false);
};

function showImage(name, type){
    var file;

    if (type == 'image/png' || type == 'image/jpeg' || type == 'image/gif')
        file = '<img src="/fileStore/' + name + '" width="80%"/>';
    else if (checkMimetype(type))
        file = `<iframe src="/fileStore/${name}" width="80%"/>`;
    else 
        file = '<p>' + name + ', ' + type + '<p>';
    
    var fileObj = $(`
        <div class="w3-row w3-margin">
            <div class="w3-col s6">
                ${file}
            </div>
            <div class="w3-col s6 w3-border">
                <p>Filename: ${name}</p>
                <p>Mimetype: ${type}</p>
            </div>
        </div>
    `);
    
    $('#display_recurso').empty();
    $('#display_recurso').append(file);
    $('#display_recurso').modal();
}

function injectForm() {
    var newFileId = parseInt($('#anotherFile').attr('class')) + 1;

    //atualizar o id do último ficheiro na class da div onde se inserem os forms extra
    $('#anotherFile').attr('class', newFileId);

    let form = `
        <div id="${newFileId}" style="margin: 20px">
            <hr>

            <input hidden name="nr_visibilidade" value="${newFileId}">

            <div class="login_container">
                <div class="w3-col s3">
                    <label class="w3-text-teal"><b>Ficheiro: </b></label>
                </div>
                <div class="w3-col s9 w3-border">
                    <input class="w3-input w3-border w3-light-grey" type="file" name="recurso" required>
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
                    <select class="w3-input w3-border w3-light-grey" name="tipo" required>
                        <option hidden disabled select value></option>
                        <option value="relatorio"> Relatório </option>
                        <option value="tese"> Tese </option>
                        <option value="artigo"> Artigo </option>
                        <option value="aplicacao"> Aplicação </option>
                        <option value="slides"> Slides </option>
                        <option value="testeexame"> Teste/Exame </option>
                        <option value="problemaresolvido"> Problema resolvido </option>
                </div>
            </div>

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
}

function removeFormChunk(id) {
    $('#'+id).remove();
}