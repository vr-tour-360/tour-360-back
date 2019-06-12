const validEmail = (value: string) => {
    value = value.trim();
    const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (value === '') {
        return { valid: false, error: 'please fill out this field' };
    }

    return emailRe.test(value) ? { valid: true, error: '' } : { valid: false, error: 'wrong email' };
};

const validPassword = (value: string) => {
    const passwordRe = /^(.{8,})$/;

    if (value.trim() === '') {
        return { valid: false, error: 'please fill out this field' };
    }

    return passwordRe.test(value) ? { valid: true, error: '' } : { valid: false, error: 'password must be at least 8 characters long' };
};

const validName = (value: string) => {
    value = value.trim();
    const nameRe = /^([a-zA-Z]|[а-яА-Я]){2,}$/;

    if (value === '') {
        return { valid: false, error: 'please fill out this field' };
    }

    if (value.length < 2) {
        return { valid: false, error: 'name must be at least 2 characters long' };
    }

    return nameRe.test(value) ? { valid: true, error: '' } : { valid: false, error: 'name must contain only latin and russian characters' };
};

const validateForm = (form) => {
    const { email, firstName, lastName, password } = form;
    let errors = [];
    let errorMessage;

    let emailValidation = validEmail(email);
    let firstNameValidation = validName(firstName);
    let lastNameValidation = validName(lastName);
    let passwordValidation = validPassword(password);

    !emailValidation.valid && errors.push(emailValidation.error);
    !firstNameValidation.valid && errors.push(firstNameValidation.error);
    !lastNameValidation.valid && errors.push(lastNameValidation.error);
    !passwordValidation.valid && errors.push(passwordValidation.error);

    if (errors.length) {
        errorMessage = `errors: \n${errors.join(',\n')}`;
        return { isValid: false, error: errorMessage };
    } else {
        return { isValid: true, error: '' }
    }
}

export {
    validateForm,
    validEmail,
    validName,
};
