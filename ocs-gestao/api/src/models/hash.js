import crypto, { getHashes } from "crypto";

function getHash(texto){
    const encriptKey = 'MR8HaB&H*jK&*6^77fNlaIgd';
    const hash = crypto.createHash('md5').update(texto + encriptKey).digest("hex");
    return hash;
}

export default getHash;