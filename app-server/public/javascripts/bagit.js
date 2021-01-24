$(document).ready(function()
  {
    $('body').on('click', '#upload', function(e){
        e.preventDefault();

        var i = 0; 
        var form = document.getElementById('myForm');
        var formData = new FormData(form);
        var fileRadioButton = {}
        var files = {}
        var zip = new JSZip();
        for (var [key, value] of formData.entries()) { 
            if(key.match(/^visibilidade[0-9]+$/)){
                fileRadioButton[key.split(/visibilidade/)[1]] = value
            }
            else if(key == "recurso"){
                zip.file("data/" + value.name, value)
                files[i++] = value.name
            }
        }
        console.log(JSON.stringify(fileRadioButton))
        var manifest = getManifestString(files)
        zip.file("manifest-md5.txt",manifest)

        zip.generateAsync({type:'blob'}).then((blobdata)=>{
            // create zip blob file
            let zipblob = new Blob([blobdata])
    
            // For development and testing purpose
            // Download the zipped file 
            var elem = window.document.createElement("a")
            elem.href = window.URL.createObjectURL(zipblob)
            elem.download = 'compressed.zip'
            elem.click()
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
      $(`input[name = "checksum${id}"]`).attr('value', hash)
      console.log("HASH: " + hash)
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