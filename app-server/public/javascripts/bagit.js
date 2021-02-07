$(document).ready(function()
  {
    $('body').on('click', '#upload', function(e){
        e.preventDefault();

        var form = document.getElementById('myForm');
        $('.nova').remove()

        var formData = new FormData(form);
        console.log("START")
        console.log([...formData])

        var checksums = []
        var hashes = []
        var ficheiros = []
        var zip = new JSZip();

        for (var [key, value] of formData.entries()) {
          if (/^checksum/.test(key)) {
            checksums.push(key)
            hashes.push(value)
          }
          if(key == "recurso"){
            zip.file("data/" + value.name, value)
            ficheiros.push(value.name)
          }
        }
        var manifest = getManifestString(hashes, ficheiros)
        zip.file("manifest-md5.txt",manifest)

        zip.generateAsync({type:'blob'}).then((blobdata)=>{
          //o zip chama-se blob
          formData.delete("recurso")
          for (var i = 0; i < checksums.length; i++) formData.delete(checksums[i])

          formData.append("zip",blobdata)
          console.log("FIM")
          console.log([...formData])
          
          $.ajax({
            url: "/recursos/upload",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response){
              window.location.replace("/recursos");
            }
          });
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
function getManifestString(hashes, ficheiros){
    var str = ''
    for(var i = 0; i < hashes.length; i++){
      str += `${hashes[i]} data/${ficheiros[i]}\n`
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