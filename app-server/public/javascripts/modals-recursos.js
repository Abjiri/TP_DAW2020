function adicionarLinha(nr, operacao) {
    var html = `<tr id="linha${nr}" class="nova">
            <th class="nome"></th>
            <th class="tamanho"></th>
            <th class="preview"></th>
            <th>`
    
    if (operacao == 'upload') html += `<input hidden name="checksum${nr}" value="">`

    html += `   <button class="adicionar" type="button" onclick="adicionarFicheiro(${nr}, '${operacao}')"> &#10133; </button>
                <input name="recurso" type="file" id="novoFicheiro${nr}" `

    if (operacao == 'upload') html += `onchange='getChecksum(this,${nr})' ` 
    
    html += `style="display: none">
                <button class="remover" type="button" style="color: red; boder-radius: none; display: none" onclick="removerFicheiro('linha${nr}', '${operacao}')"> &#10006; </button>
            </th>
        </tr>`

    return html
}

function editarRecurso(recurso) {
    $('#editar_recurso').empty()
    var r = JSON.parse(recurso)
    var tipos = JSON.parse($('#tipos_edicao').val())
  
    var html = `
    <form class="my-modal-content" style="width: 60%" action="/recursos/editar/${r._id}" method="POST" enctype="multipart/form-data">

      <h2 style="margin: 10px 20px 20px 20px">Editar recurso</h2>
      <div class="login_container">
        <input type="text" name="idAutor" value="${r.idAutor}" hidden>

        <div class="login_container">
            <div class="w3-col s3">
                <label class="w3-text-teal"><b>Nome: </b></label>
            </div>
            <div class="w3-col s9 w3-border">
                <input class="w3-input w3-border w3-light-grey" type="text" name="titulo" value="${r.titulo}" required>
            </div>
        </div>

        <div class="login_container">
            <div class="w3-col s3">
                <label class="w3-text-teal"><b>Descrição: </b></label>
            </div>
            <div class="w3-col s9 w3-border">
                <textarea class="w3-input w3-border w3-light-grey" type="text" name="descricao" required>${r.descricao}</textarea>
            </div>
        </div>

        <div class="login_container">
            <div class="w3-col s3">
                <label class="w3-text-teal"><b>Tipo: </b></label>
            </div>
            <div class="w3-col s9 w3-border">
                <select id="tipo_recurso" onchange="showNewTypeInput()" class="w3-input w3-border w3-light-grey" name="tipo" required>`
    
    tipos.forEach(t => {
        html += `<option value="${t}"`
        if (t == r.tipo) html += ' selected'
        html += `> ${t} </option>`
    })

    html += `       <option value="Outro"> Outro </option>
                </select>
            </div>
        </div>

        <div id="outro_tipo_recurso" class="login_container" style="display: none">
            <div class="w3-col s3">
                <label class="w3-text-teal"><b>Outro: </b></label>
            </div>
            <div class="w3-col s9 w3-border">
                <input class="w3-input w3-border w3-light-grey" type="text" name="outro_tipo">
            </div>
        </div>

        <script>
            function showNewTypeInput() {
                var value = document.getElementById("tipo_recurso").value
                var input = document.getElementById("outro_tipo_recurso")

                if (value == "Outro") input.style.display = "block";
                else input.style.display = "none";
            }
        </script>

        <div class="login_container">
            <div class="w3-col s3" style="margin-top: 20px; margin-bottom: 20px">
                <label class="w3-text-teal"><b>Visibilidade: </b></label>
            </div>
            <div class="w3-col s9">
                <label id="switch" class="switch" style="margin-top: 20px; margin-bottom: 20px">
                    <input type="checkbox" name="visibilidade" id="slider"`
    
    if (!r.visibilidade) html += ' checked'

    html += `>
                    <span class="slider round"></span>
                </label>
            </div>
        </div>

        <input id="removerFicheiros" name="removerFicheiros" value="[]" hidden>

        <div class="login_container">
            <div class="w3-col s3">
                <label class="w3-text-teal"><b>Ficheiros: </b></label>
            </div>
            <div class="w3-col s9">
                <table id="ficheiros-edicao" class="w3-table-all" style="margin-bottom: 20px">
                    <tr>
                        <th> Nome </th>
                        <th> Tamanho </th>
                        <th> Visualizar </th>
                        <th></th>
                    </tr>`
                    
    r.ficheiros.forEach(f => {
        html += `<tr id="${f._id}">
                    <td> ${f.nome_ficheiro} </td>
                    <td> ${f.tamanho} </td>
                    <td><button type="button" class="resource-btn" onclick='mostrarPreviewAntigo("${f.nome_ficheiro}", "${f.tipo_mime}", "${f.diretoria}")')> 👁 </button></td>
                    <td><button type="button" style="color: red" onclick="removerFicheiro('${f._id}', 'edicao')"> &#10006; </button></td>
                </tr>`
    })

    html += adicionarLinha(0, 'edicao')
    html += `
                </table>
            </div>
        </div>
  
        <div class="w3-row login_container w3-margin-bottom">
            <input class="w3-btn w3-blue-grey w3-margin-top" style="float:right" type="submit" value="Submeter"/>
            <input class="w3-btn w3-blue-grey w3-margin-top" onclick="cancelarEdicao()" style="float:right; margin-right: 10px" type="button" value="Cancelar"/>
        </div>
        </div>
    </form>`
  
    $('#editar_recurso').append(html)
    document.getElementById('editar_recurso').style.display = 'block'; 
}

function adicionarFicheiro(nr, operacao) {
    $('#novoFicheiro'+nr).click();
    $('#novoFicheiro'+nr).change(function () {
        if (this.files) {
            $('#linha'+nr).attr("class",'')
            var detalhes = this.files[0]

            $(`#linha${nr} .nome`).html(detalhes.name)
            $(`#linha${nr} .tamanho`).html(calcularTamanho(detalhes.size))

            var preview = '<button type="button" class="resource-btn" onclick="mostrarPreviewNovo('+nr+')"> 👁 </button>'
            $(`#linha${nr} .preview`).html(preview)

            $(`#linha${nr} button.adicionar`).css("display","none")
            $(`#linha${nr} button.remover`).css("display","inline-block")
            
            $(`#ficheiros-${operacao} tr:last`).after(adicionarLinha(nr+1, operacao))
        }
    })
}

function checkMimetype(type) {
    return Array.prototype.reduce.call(navigator.plugins, function (supported, plugin) {
        return supported || Array.prototype.reduce.call(plugin, function (supported, mime) {
            return supported || mime.type == type;
        }, supported);
    }, false);
}

function mostrarPreviewAntigo(nome, tipo, diretoria) {
    var html;

    if (tipo == 'image/png' || tipo == 'image/jpeg' || tipo == 'image/gif')
        html = `<span class="helper"></span><img id="previewNovoFicheiro" src="${diretoria}" style="max-width:100%; max-height:100%; border: 10px solid #000"/>`;
    else if (checkMimetype(tipo))
        html = `<iframe id="previewNovoFicheiro" src="${diretoria}" style="width:100%; height:100%"/>`;
    else 
        html = '<p>' + nome + ', ' + tipo + '<p>';
        
    $('#preview_ficheiro_form').empty();
    $('#preview_ficheiro_form').append(html);
    $('#preview_ficheiro_form').modal();
}

function mostrarPreviewNovo(nr) {
    var ficheiro = $('#novoFicheiro'+nr)[0].files[0]
    var html;

    if (ficheiro.type == 'image/png' || ficheiro.type == 'image/jpeg' || ficheiro.type == 'image/gif')
        html = `<span class="helper"></span><img id="previewNovoFicheiro" src="" style="max-width:100%; max-height:100%; border: 10px solid #000"/>`;
    else if (checkMimetype(ficheiro.type))
        html = `<iframe id="previewNovoFicheiro" src="" style="width:100%; height:100%"/>`;
    else 
        html = '<p>' + ficheiro.name + ', ' + ficheiro.type + '<p>';
        
    $('#preview_ficheiro_form').empty();
    $('#preview_ficheiro_form').append(html);

    var reader = new FileReader();
    reader.onload = function(e) { $('#previewNovoFicheiro').attr('src', e.target.result); }

    reader.readAsDataURL(ficheiro); // convert to base64 string
    $('#previewNovoFicheiro').css("display","inline-block")

    $('#preview_ficheiro_form').modal();
}

function previewFicheiro(nome, diretoria, tipo_mime){
    var file

    if (tipo_mime == 'image/png' || tipo_mime == 'image/jpeg' || tipo_mime == 'image/gif')
        file = `<span class="helper"></span><img class="center" src="${diretoria}" style="max-width:90%; max-height:90%; border: 10px solid #000;"/>`;
    else if (checkMimetype(tipo_mime))
        file = `<iframe src="${diretoria}" style="width:100%; height:100%"/>`;
    else 
        file = '<p>' + nome + ', ' + tipo_mime + '<p>';
    
    $('#preview_ficheiro').empty();
    $('#preview_ficheiro').append(file);
    $('#preview_ficheiro').modal();
}

function removerFicheiro(id, operacao) {
    var nrLinhas = $(`#ficheiros-${operacao} tr`).length - 2 //th's e linha de adicionar recursos
    if (nrLinhas == 1) window.alert('O recurso precisa de ter pelo menos 1 ficheiro!') 
    else {
        if (operacao == 'edicao') {
            var removerFicheiros = JSON.parse($('#removerFicheiros').val())
            removerFicheiros.push(id)
            $('#removerFicheiros').val(JSON.stringify(removerFicheiros))
        }

        $('#'+id).remove()
    }
}

function cancelarEdicao() {
    document.getElementById('editar_recurso').style.display = 'none';
}

function calcularTamanho(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    else {
      var kb = bytes/1024;
      if (kb < 1024) return `${(kb.toFixed(2))} KB`;
      else {
        var mb = kb/1024;
        if (mb < 1024) return `${(mb.toFixed(2))} MB`;
  
        return `${(mb/1024).toFixed(2)} GB`;
      }
    }
  }