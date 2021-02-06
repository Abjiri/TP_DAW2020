var AdmZip = require('adm-zip')
var func = require('./functions')

function genManifest(ficheiros){
    var manifest = ''
    ficheiros.forEach(f => {
        manifest += `${f.hash} data/${f.nome_ficheiro}\n`
    })
    return manifest
}

function zipRecurso(ficheiros){
    var zip = new AdmZip()
    var dir = __dirname.replace(/\\/g, "/").replace("routes","public")
    var manifest = genManifest(ficheiros)
    zip.addFile("manifest-md5.txt", manifest)
    ficheiros.forEach(f => {
        let nome = f.diretoria.replace("/fileStore/", "")
        zip.addLocalFile(dir + f.diretoria)
        zip.getEntry(nome).entryName = "data/" + f.nome_ficheiro
    })
    return zip.toBuffer()
}

function zipAll(zips){
    var zip = new AdmZip()
    var manifest = ''
    var dir = __dirname.replace(/\\/g, "/").replace("routes","public")
    zips.forEach(z => {
        var hash = func.calculateMd5_Buffer(z.zip)
        manifest += `${hash} data/${z.titulo}.zip\n`
        zip.addFile(`data/${z.titulo}.zip`, z.zip)
    })
    zip.addFile("manifest-md5.txt",manifest)
    return zip.toBuffer()
}

module.exports = {
    zipRecurso,
    zipAll
}