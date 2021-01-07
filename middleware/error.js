module.exports = async (error, req, res, next) => {
    console.error(error.message, error)
    return res.status(500).send({ message: 'Internal server error something failed.' })
}