const getCurrentTimeStamp = () => {
    return new Date().getTime();
}

const generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: getCurrentTimeStamp()
    };
};

const generateLocationMessage = (from, lat, long) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${lat},${long}`,
        createdAt: getCurrentTimeStamp()
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage
};