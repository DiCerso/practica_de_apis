const path = require('path');
const db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const { getUrl, isNumber } = require('../../helpers')


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    list: async (req, res) => {
        try {
            movies = await db.Movie.findAll({
                include: ['genre']
            })
            let response = {
                ok: true,
                meta: {
                    status: 200,
                    total: movies.length,
                },
                url: getUrl(req),
                data: movies
            }
            return res.status(200).json(response);

        } catch (error) {
            let response = {
                ok: false,
                meta: {
                    status: 500,
                },
                url: getUrl(req),
                msg: error.messaje ? error.messaje : "comuniquese con el administrador"
            }
            return res.status(500).json(response);
        }

    },
    detail: async (req, res) => {

        try {
            let movie = await db.Movie.findByPk(req.params.id,
                {
                    include: ['genre']
                }
            )
            let response = isNumber(req.params.id, req, "id");
            if (response) {
                return res.status(400).json(response);
            }
            if (movie) {
                let response = {
                    ok: true,
                    meta: {
                        status: 200,
                    },
                    url: getUrl(req),
                    data: movie
                }
                return res.status(200).json(response);
            } else {
                let response = {
                    ok: false,
                    meta: {
                        status: 404,
                    },
                    msg: "no existe una pelicula con ese id",
                    url: getUrl(req),
                }
                return res.status(404).json(response);
            }

        } catch (error) {
            let response = {
                ok: false,
                meta: {
                    status: 500,
                },
                url: getUrl(req),
                msg: error.messaje ? error.messaje : "comuniquese con el administrador"
            }
            return res.status(500).json(response);
        }

    },
    newmo: async (req, res) => {

        try {
            let movies = await db.Movie.findAll({
                order: [
                    ['release_date', 'DESC']
                ],
                limit: 5
            })

            let response = {
                ok: true,
                meta: {
                    status: 200,
                    total: movies.length,
                },
                url: getUrl(req),
                data: movies
            }
            return res.status(200).json(response);
        } catch (error) {
            let response = {
                ok: false,
                meta: {
                    status: 500,
                },
                url: getUrl(req),
                msg: error.messaje ? error.messaje : "comuniquese con el administrador"
            }
            return res.status(500).json(response);
        }
    },
    recomended: async (req, res) => {

        try {
            let movies = await db.Movie.findAll({
                include: ['genre'],
                where: {
                    rating: { [db.Sequelize.Op.gte]: 8 }
                },
                order: [
                    ['rating', 'DESC']
                ]
            })

            let response = {
                ok: true,
                meta: {
                    status: 200,
                    total: movies.length,
                },
                url: getUrl(req),
                data: movies
            }
            return res.status(200).json(response);

        } catch (error) {
            let response = {
                ok: false,
                meta: {
                    status: 500,
                },
                url: getUrl(req),
                msg: error.messaje ? error.messaje : "comuniquese con el administrador"
            }
            return res.status(500).json(response);
        }
    },
    create: async function (req, res) {
        try {
            let genero = await db.Genre.findByPk(req.body.genre_id)
            let rating = isNumber(req.body.rating, req, "rating");
            if (rating) {
                return res.status(400).json(rating);
            }
            let awards = isNumber(req.body.awards, req, "awards");
            if (awards) {
                return res.status(400).json(awards);
            }
            let length = isNumber(req.body.length, req, "length");
            if (length) {
                return res.status(400).json(length);
            }
            if (genero) {
                let movie = await db.Movie.create(
                    {
                        title: req.body.title,
                        rating: req.body.rating,
                        awards: req.body.awards,
                        release_date: req.body.release_date,
                        length: req.body.length,
                        genre_id: req.body.genre_id
                    }
                )
                let response = {
                    ok: true,
                    meta: {
                        status: 200,
                    },
                    url: getUrl(req),
                    data: movie
                }
                return res.status(200).json(response);
            } else {
                let response = {
                    ok: false,
                    meta: {
                        status: 400,
                    },
                    url: getUrl(req),
                    msg: "el genero ingresado no existe"
                }
                return res.status(500).json(response);
            }
        } catch (error) {
            let response = {
                ok: false,
                meta: {
                    status: 500,
                },
                url: getUrl(req),
                msg: error.messaje ? error.messaje : "comuniquese con el administrador"
            }
            return res.status(500).json(response);
        }


    },
    update: async function (req, res) {
        try {
            let genero = await db.Genre.findByPk(req.body.genre_id)
            if (req.body.genre_id && !genero) {
                let response = {
                    ok: false,
                    meta: {
                        status: 400,
                    },
                    url: getUrl(req),
                    msg: "el genero ingresado no existe"
                }
                return res.status(400).json(response);
            }

            let rating = isNumber(req.body.rating, req, "rating");
            if (req.body.rating && rating) {
                return res.status(400).json(rating);
            }
            let awards = isNumber(req.body.awards, req, "awards");
            if (req.body.awards && awards) {
                return res.status(400).json(awards);
            }
            let length = isNumber(req.body.length, req, "length");
            if (req.body.length && length) {
                return res.status(400).json(length);
            }
            let movieId = isNumber(req.params.id, req, "id");
            if (movieId) {
                return res.status(400).json(movieId);
            }
            movieId = await db.Movie.findByPk(req.params.id);
            if(!movieId){
                let response = {
                    ok: false,
                    meta: {
                        status: 400,
                    },
                    url: getUrl(req),
                    msg: "El id ingresado no pertenece a ninguna pelicula"
                }
                return res.status(400).json(response);
            }
            movieId = req.params.id;

            let movie = await db.Movie.update({
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            },
                {
                    where: { id: movieId }
                }
            )
            let movieUpdate = await db.Movie.findByPk(req.params.id);

            if (movie) {
                let response = {
                    ok: true,
                    meta: {
                        status: 200,
                    },
                    url: getUrl(req),
                    data: movieUpdate
                }
                return res.status(200).json(response);
            } else {
                let response = {
                    ok: false,
                    meta: {
                        status: 400,
                    },
                    url: getUrl(req),
                    msg: "no se encuentra la pelicula a modificar"
                }
                return res.status(400).json(response);
            }

        } catch (error) {
            let response = {
                ok: false,
                meta: {
                    status: 500,
                },
                url: getUrl(req),
                msg: error.messaje ? error.messaje : "comuniquese con el administrador"
            }
            return res.status(500).json(response);        }
    },
    destroy: async (req, res) => {

        try {
            let movieId = isNumber(req.params.id, req, "id");
            if (movieId) {
                return res.status(400).json(movieId);
            }
            movieId = await db.Movie.findByPk(req.params.id);
            if(!movieId){
                let response = {
                    ok: false,
                    meta: {
                        status: 400,
                    },
                    url: getUrl(req),
                    msg: "El id ingresado no pertenece a ninguna pelicula"
                }
                return res.status(400).json(response);
            }
            movieId = req.params.id;
            let movie = await db.Movie.destroy({ where: { id: movieId }, force: false })
            if(movie){
                let response = {
                    ok: true,
                    meta: {
                        status: 200,
                    },
                    url: getUrl(req),
                    msg : "la pelicula fue borrada con exito"
                }
                return res.status(200).json(response);
            }else{
                let response = {
                    ok: false,
                    meta: {
                        status: 500,
                    },
                    url: getUrl(req),
                    msg : "no se hicieron cambios"
                }
                return res.status(500).json(response);
            }
            

        } catch (error) {
            let response = {
                ok: false,
                meta: {
                    status: 500,
                },
                url: getUrl(req),
                msg: error.messaje ? error.messaje : "comuniquese con el administrador"
            }
            return res.status(500).json(response);
        }
    }
}

module.exports = moviesController;