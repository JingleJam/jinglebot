// Util to allow for easy overriding when testing
const getNow = () => {
    const date = new Date();
    date.setFullYear(2024);
    date.setMonth(11);
    return date;
};

export default getNow;
