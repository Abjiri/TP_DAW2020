function showPostForm(id){
    $('#new_post_modal').empty()
    var html = `
  <form class="my-modal-content" action="/publicacoes" method="POST">
    <h2 style="margin: 10px 20px 20px 20px">Criar Publicação</h2>
    <div class="login_container">
      <div class="login_container">
        <div class="w3-col s3">
          <label class="w3-text-teal"><b>Recurso: </b></label>
        </div>
        <div class="w3-col s9 w3-border">
          <input class="w3-input w3-border w3-light-grey" type="text" name="recurso" value=${id} readonly />
        </div>
        <div class="w3-col s3">
          <label class="w3-text-teal"><b>Título: </b></label>
        </div>
        <div class="w3-col s9 w3-border">
          <input class="w3-input w3-border w3-light-grey" type="text" name="titulo" required="required"/>
        </div>
      </div>
      <div class="login_container">
        <div class="w3-col s3">
          <label class="w3-text-teal"><b>Corpo: </b></label>
        </div>
        <div class="w3-col s9 w3-border">
          <input class="w3-input w3-border w3-light-grey" type="text" name="corpo" required="required"/>
        </div>
      </div>
      <div class="w3-row login_container w3-margin-bottom">
        <input class="w3-btn w3-blue-grey w3-margin-top" style="float:right" type="submit" value="Submeter"/>
        <input class="w3-btn w3-blue-grey w3-margin-top" id="close_new_post" style="float:right; margin-right: 10px" type="button" value="Cancelar"/>
      </div>
    </div>
  </form>`
    $('#new_post_modal').append(html)
    $("#close_new_post").click(function(event) {
        event.preventDefault();
        document.getElementById('new_post_modal').style.display='none';   
    });
    document.getElementById('new_post_modal').style.display='block'; 
}