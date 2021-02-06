function checkMimetype(type) {
    return Array.prototype.reduce.call(navigator.plugins, function (supported, plugin) {
        return supported || Array.prototype.reduce.call(plugin, function (supported, mime) {
            return supported || mime.type == type;
        }, supported);
    }, false);
};

function showImage(nome, diretoria, tipo_mime){
    var file;

    if (tipo_mime == 'image/png' || tipo_mime == 'image/jpeg' || tipo_mime == 'image/gif')
        file = `<span class="helper"></span><img class="center" src="${diretoria}" style="max-width:90%; max-height:90%; border: 10px solid #000;"/>`;
    else if (checkMimetype(tipo_mime))
        file = `<iframe src="${diretoria}" style="width:100%; height:100%"/>`;
    else 
        file = '<p>' + nome + ', ' + tipo_mime + '<p>';
    
    $('#display_recurso').empty();
    $('#display_recurso').append(file);
    $('#display_recurso').modal();
}

function injectForm() {
    var newFileId = parseInt($('#anotherFile').attr('class')) + 1;

    //atualizar o id do último ficheiro na class da div onde se inserem os forms extra
    $('#anotherFile').attr('class', newFileId);
    
    let form = `
        <div id="${newFileId}">
            <input hidden name="checksum${newFileId}" value=""> 

            <div class="w3-col s3">
                <label class="w3-text-teal"><b>Ficheiro: </b></label>
            </div>
            <div class="w3-col s9 w3-border">
                <input class="w3-input w3-border w3-light-grey" type="file" name="recurso" onchange="getChecksum(this,${newFileId})" required>
            </div>
            
            <input class="w3-btn w3-blue-grey" type="button" value="Remover" onclick='removeFormChunk(${newFileId})'/>
        </div>`;
        
    $('#anotherFile').append(form);
}

function removeFormChunk(id) {
    var newFileId = parseInt($('#anotherFile').attr('class')) - 1;
    $('#anotherFile').attr('class', newFileId);
    $('#'+id).remove();
}