export const formatKey = (key) => {
   const firstPart = key.slice(0,4);
    const lastPart = key.slice(-4);
    return `${firstPart}*******${lastPart}`;
}