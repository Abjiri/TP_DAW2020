$(document).ready(function()
  {
    $('body').on('click', '#upload', function(e){
        e.preventDefault();

        var i = 0; 
        var form = document.getElementById('myForm');

        var total = parseInt($(`#ficheiros-upload tr`).length - 2) //th's e linha de adicionar recursos
        $('#linha'+total).remove()

        var formData = new FormData(form);
        console.log("START")
        console.log([...formData])
        var files = {}
        var zip = new JSZip();
        for (var [key, value] of formData.entries()) {
          if(key == "recurso"){
            zip.file("data/" + value.name, value)
            files[i++] = value.name
          }
        }
        var manifest = getManifestString(files)
        zip.file("manifest-md5.txt",manifest)

        zip.generateAsync({type:'blob'}).then((blobdata)=>{
          //o zip chama-se blob
          formData.delete("recurso")
          for(var i = 0; i < total; i++){
            formData.delete("checksum"+i)
          }
          formData.append("zip",blobdata)
          console.log("FIM")
          console.log([...formData])
          
          /* $.ajax({
            url: "/recursos/upload",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response){
              window.location.replace("/recursos");
            }
          }); */
          // For development and testing purpose
            // create zip blob file
            // Download the zipped file 
            //let zipblob = new Blob([blobdata])
            //var elem = window.document.createElement("a")
            //elem.href = window.URL.createObjectURL(zipblob)
            //elem.download = 'compressed.zip'
            //elem.click()
        })
    })
})

function getChecksum(input, id){
  console.log(id)
    let file = input.files[0];

    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function() {
      var hash = CryptoJS.MD5(reader.result).toString();
      console.log($(`input[name = "checksum${id}"]`))
      $(`input[name = "checksum${id}"]`).val(hash)
      console.log("HASH: " + hash)
      console.log($(`input[name = "checksum${id}"]`).val())
    };

    reader.onerror = function() {
      console.log(reader.error);
    };
}

// returns the manifest
function getManifestString(files){
    var total = parseInt($('#anotherFile').attr('class')) + 1
    var str = ''
    for(var i = 0; i < total; i++){
        var elem = $(`input[name = "checksum${i}"]`)
        var hash = elem.attr('value')
        var file = files[i]
        str += `${hash} data/${file}\n`
    }
    return str
}

// calculate the hash
function calculateMd5(blob, callback) {
    var reader = new FileReader();
    reader.readAsBinaryString(blob);
    reader.onloadend = function () {
      var  hash = CryptoJS.MD5(reader.result).toString();
      callback(hash);
    };
  }