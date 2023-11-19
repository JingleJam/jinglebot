// Util to allow for easy overriding when testing
// TODO: switch back to new Date() when we're done testing
const getNow = () => new Date("2023-12-01T23:15:00.000Z");

export default getNow;
