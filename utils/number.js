const { randomBytes } = require("crypto");

exports.random = async (Min, Max) =>
{
    return Min + Math.floor(randomBytes(4).readUInt32LE() / 0xffffffff * (Max - Min + 1));
}
