const Joi = require('joi');

const  patchValidator = (req, res, next) => {
    const schema = Joi.object({
        completed: Joi.boolean().strict().required(),
    })
    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    next()
}

module.exports = patchValidator;