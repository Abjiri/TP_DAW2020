function editarRecurso(id, nome, desc, tipo, vis, tipos) {
    $('#editar_recurso').empty()
    var tipos = JSON.parse($('#tipos_edicao').val())
  
    var html = `
    <form class="my-modal-content" action="/recursos/editar/${id}" method="POST">
      <h2 style="margin: 10px 20px 20px 20px">Editar recurso</h2>
      <div class="login_container">

        <div class="login_container">
            <div class="w3-col s3">
                <label class="w3-text-teal"><b>Nome: </b></label>
            </div>
            <div class="w3-col s9 w3-border">
                <input class="w3-input w3-border w3-light-grey" type="text" name="titulo" value="${nome}" required>
            </div>
        </div>

        <div class="login_container">
            <div class="w3-col s3">
                <label class="w3-text-teal"><b>Descrição: </b></label>
            </div>
            <div class="w3-col s9 w3-border">
                <textarea class="w3-input w3-border w3-light-grey" type="text" name="descricao" required>${desc}</textarea>
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
        if (t == tipo) html += ' selected'
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
            <div class="w3-col s3">
                <label class="w3-text-teal"><b>Visibilidade: </b></label>
            </div>
            <div class="w3-col s9">
                <label id="switch" class="switch">
                    <input type="checkbox" name="visibilidade" id="slider"`
    
    if (!JSON.parse(vis)) html += ' checked'

    html += `>
                    <span class="slider round"></span>
                </label>
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

function cancelarEdicao() {
    document.getElementById('editar_recurso').style.display = 'none';
}