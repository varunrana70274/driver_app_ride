import { Platform } from 'react-native';
export default class Helper {

    /**
     * For sorting
     * @param {*any} a 
     * @param {*any} b 
     */
    static compare(a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }

    /**
     * Validate email address
     * @param {*string} email 
     */
    static validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    /**
     * Validate mobile
     * @param {*string} number
     */
    static validateMobile(number) {
        // var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (number && number.length >= 10 && number.length <= 12);
    }
    
    static validateSearch(dataMine, searchData, ) {
        let result = dataMine.filter(
            products => products.name.toLowerCase().includes(searchData)
                // ||
                // products.type.indexOf(searchFirstLetterCapital) != -1
                )
        return result;
    }

    /**
     * Validate mobile
     * @param {*string} number
     */
    static numberFormat(num) {
        num = num.replace(/\D/g, '');
        num = num.substring(0, 10);
        var size = num.length;
        if (size == 0) {
            num = num;
            return num;

        } else if (size < 4) {
            num = '(' + num;
            return num;

        } else if (size < 7) {
            num = '(' + num.substring(0, 3) + ') ' + num.substring(3, 6);
            return num;

        } else {
            num = '(' + num.substring(0, 3) + ') ' + num.substring(3, 6) + ' - ' + num.substring(6, 10);
            return num;
        }
    }
/**
     * Validate mobile
     * @param {*string} number
     */
    static cardNumberFormat(cardNum) {
        return cardNum.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').replace(".", '').trim();
    }
/**
     * Validate mobile
     * @param {*string} number
     */
    static cardExpiryDateFormat(date) {

        date = date.replace(/\D/g, '');
        date = date.substring(0, 10);

        var size = date.length;
        if (size == 0) {
            date = date;
            return date
        } else if (size < 3) {
            date = date;
            return date
        } else if (size < 4) {
            date = date.substring(0, 2) + '/ ' + date.substring(2, 3);
            return date
        }
        else {
            date = date.substring(0, 2) + '/ ' + date.substring(2, 4);
            return date
        }
    }
/**
     * Validate mobile
     * @param {*string} password
     */
    /** Validate password */
    static validatePassword = (value) => {
        return (value && value.length >= 8) ? true : false;
    }

    /**
     * Merge objects
     * @param {*object} obj 
     * @param {*function} oldObj 
     */
    static mergeObject(obj, oldObj) {
        return Object.assign(obj, oldObj)
    }


    /**
     * Check for, is object empty?
     * @param {*object} obj 
     * @param {*function} cb 
     */
     static isObjectEmpty(obj, cb) {
        let names = Object.getOwnPropertyNames(obj);
        return Promise.resolve({ status: (names.length === 0) ? true : false, names });
    }

    /**
     * Validate the request 
     * @param {*object} obj 
     */
    static validate(parameters, obj) {
        return this.isObjectEmpty(obj)
            .then(({ status, names }) => {
                if (!status) {
                    let existedFields = {
                        keys: names,
                        emptyKeys: []
                    }
                    parameters.forEach((element, index) => {
                        !obj[element] && existedFields.emptyKeys.push({ fieldName: element, message: "Required" });
                    });

                    //Specific fields validations
                    existedFields.emptyKeys.length <= 0 &&
                        existedFields.keys.forEach((element) => {
                            switch (element) {
                                case "email":
                                    !this.validateEmail(obj["email"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Email address is not valid." });
                                    break;
                                case "mobile_number":
                                    !this.validateMobile(obj["mobile_number"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Mobile number is not valid." });
                                    break;
                                case "password":
                                    !this.validatePassword(obj["password"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Password at least 5 characters" });
                                    break;
                                case "confirm_password":
                                    if (obj["password"] !== obj["confirm_password"]) {
                                        existedFields.emptyKeys.push({ fieldName: "password", message: "Password is not matched." });
                                        existedFields.emptyKeys.push({ fieldName: "confirm_password", message: "Password is not matched." });
                                    }
                                    break;
                            }
                        });

                    return Promise.resolve({ status: existedFields.emptyKeys.length > 0 ? false : true, response: existedFields.emptyKeys });
                } else return Promise.resolve({ status: false, response: parameters });
            });
    }

    static isValidForm = (keys, body) => {
        return Helper.validate(keys, body)
            .then(({ status, response }) => {
                if (status) {
                    return Promise.resolve({ message: "Success" });
                } else return Promise.resolve({ status, response });
            })
    }

    /** Reset and push rout in stack */
    static resetAndPushRoot(history, path) {
        history.entries = [];
        history.index = -1;
        history.push(path);
    }
}