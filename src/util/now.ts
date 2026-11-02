// Util to allow for easy overriding when testing
const getNow = () => {
    const date = new Date();
    date.setMonth(11);
    return date;
};

export default getNow;
