$(document).ready(function()
  {
    $('body').on('click', '#upload', function(e){
        e.preventDefault();
        var form = document.getElementById('myForm');
        var formData = new FormData(form);
        var fileRadioButton = {}
        var fileMD5 = {}
        var zip = new JSZip();

        for (var [key, value] of formData.entries()) { 
            if(key.match(/^visibilidade[0-9]+$/)){
                fileRadioButton[key.split(/visibilidade/)[1]] = value
            }
            else if(key == "recurso"){
                zip.file("data/" + value.name, value)
                calculateMd5(value, result => {
                    console.log("VALUE " + value)
                    fileMD5[value] = result
                    console.log("1" + JSON.stringify(fileMD5))
                })
            }
        }
        console.log(JSON.stringify(fileRadioButton))
        console.log(JSON.stringify(fileMD5))
        var manifestData = generateManifestData(fileMD5)
        zip.file("manifest-md5.txt", manifestData)
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

function generateManifestData(obj){
    var str = ''
    for (var [key, value] of Object.entries(obj)) { 
        str += `${value} data/${key}\n`
    }
    return str
}

// hash the files
function calculateMd5(blob, callback) {
    var reader = new FileReader();
    reader.readAsBinaryString(blob);
    reader.onloadend = function () {
      var  hash = CryptoJS.MD5(reader.result).toString();
      callback(hash);
    };
  }