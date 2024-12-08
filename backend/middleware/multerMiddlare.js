"use strict"
const middlare = (error, req, res, next) => {
    res.status(500).send({errorMulter: error})
}

module.exports = middlare