const {getUrl} = require('./getUrl')

const isNumber = (id, request, vari) => {
    if(isNaN(id)){
        let response = {
            ok : false,
            meta : {
                status : 400
            },
            msg : `ingrese un numero en ${vari}`,
            url : getUrl(request)
        }
        return response
    }else{
        return false
    }
}

module.exports = {
    isNumber
}