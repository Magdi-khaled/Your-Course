module.exports = (asyncCatch) => {
    return (req, res, next) => {
        asyncCatch(req, res, next).catch((error) => {
            next(error);
        });
    }
}