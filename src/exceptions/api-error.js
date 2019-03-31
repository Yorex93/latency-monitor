class ApiError extends Error{
    constructor(message){
        super(message);
        this.statusCode = 500;
    }
}

class NotFoundError extends ApiError{
    constructor(message){
        super(message);
        this.statusCode = 404;
    }
}

class ForbiddenError extends ApiError{
    constructor(message){
        super(message);
        this.statusCode = 403;
    }
}

class UnAuthorizedError extends ApiError{
    constructor(message){
        super(message);
        this.statusCode = 401;
    }
}

class BadRequestError extends ApiError{
    constructor(message){
        super(message);
        this.statusCode = 400;
    }
}

module.exports = {
    ApiError,
    NotFoundError,
    ForbiddenError,
    UnAuthorizedError,
    BadRequestError
}