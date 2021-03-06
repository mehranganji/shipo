const validator = require('validator');
const isEmpty= require('./is-empty');

module.exports = function validateRegisterInput (data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    if(validator.isEmpty(data.name))
    {
        errors.name = 'name is required';
    }
    if(validator.isEmpty(data.email))
    {
        errors.email = 'email is required';
    }
    if(validator.isEmpty(data.password))
    {
        errors.password = 'password is required';
    }
    if(!validator.isLength(data.name, {min: 2, max: 30})) {
        errors.name = 'Name must be beween 2 and 30 char';
    }
    if(!validator.isLength(data.password, {min: 8, max: 30})) {
        errors.password = 'password must be beween 8 and 30 char';
    }
    if(!validator.isEmail(data.email))
    {
        errors.email = 'email is wrong';
    }
    

    return {
        errors,
        isValid: isEmpty(errors)
    }
}