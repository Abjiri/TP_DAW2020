var fs = require('fs')
var JSZip  = require('jszip')
var JSZipUtils = require('jszip-utils')
var func = require('./functions')

function genManifest(selecionados){
    var manifest = ''
    selecionados.forEach(f => {
        var nome = f.split("-",2)[1]
        var path = __dirname.replace("\\routes","") + "\\public" + f
        var hash = func.calculateMd5(path)
        manifest += `${hash} data/${nome}\n`
    })
    return manifest
}

function zipRecursos(selecionados){
    var zip = new JSZip();
    selecionados.forEach(f => {
        var nome = f.split("-",2)[1]
        var path = __dirname.replace("\\routes","") + "\\public" + f
        var data = fs.readFileSync(path)
        zip.file("data/"+nome, data, {binary:true});
    })
    var manifest = genManifest(selecionados)
    zip.file("manifest-md5.txt",manifest)
    return zip  
}

module.exports = {
    zipRecursos
}