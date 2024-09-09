import { validaCpfCnpj } from './helpers'
function validateSomeSpecialCharacter(value: string) {
    const regex = /[,&#]/g;
    if (regex.test(value)) {
        return "O campo não podem conter os seguintes caracteres: ( , & # )";
    }
    return true;
}

function validateIsNumber(value: string) {
    const regex = /^[0-9]+$/;

    if (!regex.test(value)) {
        return "O campo deve conter apenas números";
    }
    return true;
}
// Required
function required(value: string | number) {
    // If is a string
    if (typeof value === "string" && value.trim() === "") {
        return "Campo é obrigatório";
    }

    // If is a number
    if (typeof value === "number" && !value) {
        return "Campo é obrigatório";
    }

    // If is a boolean
    if (typeof value === "boolean" && !value) {
        return "Campo é obrigatório";
    }

    // If is a array
    if (Array.isArray(value) && value.length === 0) {
        return "Campo é obrigatório";
    }

    // Else
    if (!value) {
        return "Campo é obrigatório";
    }

    return true;
}

// Min Length
function minLength(value: any, length: number) {
    if (value.length < length) {
        return `Este campo deve ter pelo menos ${length} caracteres`;
    }
    return true;
}

// Max Length
function maxLength(value: any, length: number) {
    if (!value) return true;
    if (value.length > length) {
        return `Este campo deve ter no máximo ${length} caracteres`;
    }
    return true;
}

// Between value
function between(value: any, min: number, max: number) {
    if (value < min || value > max) {
        return `Este campo deve ter um valor entre ${min} e ${max}`;
    }
    return true;
}

// Min Value
function minValue(value: any, min: number) {
    if (value < min) {
        return `Este campo deve ter um valor maior ou igual a ${min}`;
    }
    return true;
}

// Max Value
function maxValue(value: any, max: number) {
    if (value > max) {
        return `Este campo deve ter um valor menor ou igual a ${max}`;
    }
    return true;
}

function cpf(cpf = "") {
    if(!cpf) return true
    const valid = validaCpfCnpj(cpf)

    if (!valid) return "CPF inválido";

    return true;
}

function validateBirthDate(dateString: any) {
    let birthday = dateString.split("/");
    birthday = `${birthday[2]}/${birthday[1]}/${birthday[0]}`;

    const today = new Date();
    const birthDate = new Date(birthday);

    if (birthDate > today) return "Insira uma data válida";
    else return true;
}

function validateMinDate(dateString: any) {
    let nDate = dateString.split("/");
    nDate = `${nDate[2]}/${nDate[1]}/${nDate[0]}`;

    const today = new Date();
    const birthDate = new Date(nDate);

    if (birthDate < today) return "Insira uma data válida";
    else return true;
}

function email(field: string) {
    if(!field) return true
    const usuario = field.substring(0, field.indexOf("@"));
    const dominio = field.substring(field.indexOf("@") + 1, field.length);

    if (
        usuario.length >= 1 &&
        dominio.length >= 3 &&
        usuario.search("@") == -1 &&
        dominio.search("@") == -1 &&
        usuario.search(" ") == -1 &&
        dominio.search(" ") == -1 &&
        dominio.search(".") != -1 &&
        dominio.indexOf(".") >= 1 &&
        dominio.lastIndexOf(".") < dominio.length - 1
    ) {
        return true;
    } else {
        return "E-mail inválido";
    }
}

function validateNameAndSurname(value = "") {
    const text = value.split(" ");
    if (text.length === 1 || text[1] === "") {
        return "Digite nome e sobrenome";
    }

    return true;
}

function validatePhone(phone: string) {
    const regex = /^(\+55|0)?\s?\(?(\d{2})\)?\s?(9?\d{4})[\s-]?\d{4}$/;
    return (
        (regex.test(phone) && phone.replace(/[^0-9]/g, "").length >= 10) ||
        "Telefone inválido"
    );
}
function cnpj(cnpj: string) {
    if(!cnpj) return true
    const valid = validaCpfCnpj(cnpj)

    if (!valid) return "CNPJ inválido";

    return true;
}

function validateDomain(url: string) {
    const regex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
    if (regex.test(url)) {
        return true;
    } else {
        return "Domínio inválido";
    }
}
function minValueMatch(value: any, [target]: any) {
    if (parseInt(value) < parseInt(target)) {
        return `Este campo deve ter uma valor maior ou igual a ${target}`;
    }
    return true;
}

function password(password: string, [target]: any) {
    if (password !== target) {
        return 'A confirmação de senha não pode ser diferente.';
    }
    return true;
}

function passwordSeguro(password: string) {
    const especial = /[-_@!.;,><=#$%&*()+]/;
    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;
    let valid = false
    if (
      password.match(lowerCaseLetters) &&
      password.match(upperCaseLetters) &&
      password.match(numbers) &&
      password.match(especial) &&
      password.length >= 8
    ) {
        valid = true;
    } else {
        valid = false;
    }

    if (!valid) return "A senha deve conter letra maiúscula, letra minúscula, número, caractere especial e no mínimo 8 caracteres";

    return true;
}

export {
    password,
    required,
    validatePhone,
    cnpj,
    minLength,
    maxLength,
    between,
    minValue,
    maxValue,
    cpf,
    validateBirthDate,
    passwordSeguro,
    email,
    validateNameAndSurname,
    validateDomain,
    validateSomeSpecialCharacter,
    validateIsNumber,
    minValueMatch,
    validateMinDate
}