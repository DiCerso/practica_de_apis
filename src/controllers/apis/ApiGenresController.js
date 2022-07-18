const db = require('../../database/models');
const sequelize = db.sequelize;
const {getUrl, isNumber} = require('../../helpers');


const genresController = {
    list: async (req, res) => {
        try {
            let genres = await db.Genre.findAll();
            
            let response = {
                ok : true,
                meta : {
                    status : 200,
                    total : genres.length,
                },
                url : getUrl(req),
                data : genres
            }
            return res.status(200).json(response);
        } catch (error) {
            let response = {
                ok : false,
                meta : {
                    status : 500,
                },
                url : getUrl(req),
                msg : error.messaje ? error.messaje : "comuniquese con el administrador"
            }
            return res.status(500).json(response);
        }
    },
    detail: async (req, res) => {
        try {
            let genres = await db.Genre.findByPk(req.params.id);
            let response = isNumber(req.params.id, req, "id");
            if(response){
                return res.status(400).json(response)
            }
            if(genres){
                let response = {
                    ok : true,
                    meta : {
                        status : 200,
                    },
                    url : getUrl(req),
                    data : genres
                }
                return res.status(200).json(response);
            }else{
                let response = {
                    ok : false,
                    meta : {
                        status : 500,
                    },
                    url : getUrl(req),
                    msg : "no se encontro un genero con ese id"
                }
                return res.status(200).json(response);
            }
        } catch (error) {
            let response = {
                ok : false,
                meta : {
                    status : 500,
                },
                url : getUrl(req),
                msg : error.messaje ? error.messaje : "comuniquese con el administrador"
            }
            return res.status(500).json(response);
        }
    }

}

module.exports = genresController;