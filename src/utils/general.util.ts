const has = (...args: any[]) => Object.prototype.hasOwnProperty.call(args[0], args[1]);
const something = () => {};

export { has, something };
