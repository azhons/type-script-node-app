/// <reference path="typings/all.ts" />
function getEnv(env) {
    switch (env) {
        case 'dev':
        default:
            return {
                redisHost: null,
                redisPort: null
            };
    }
}
exports.getEnv = getEnv;
//# sourceMappingURL=env.js.map