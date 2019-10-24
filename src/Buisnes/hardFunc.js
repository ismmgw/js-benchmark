export default (iterations = 1) => {
    let res = 0;
    for (let i = 0; i < iterations; i++) {
        res += 1;
        res += res % 2;
    }
    return res;
};
