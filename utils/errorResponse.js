class ErrorResponse extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        // console.log(message, statusCode)
    }
}

module.exports = ErrorResponse;