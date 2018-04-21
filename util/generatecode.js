import shortid from "shortid";

shortid.characters("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@");

const generateShortCode = async(name, Model) => {
    const reg = new RegExp("[^A-Za-z]");
    const shortidcode = shortid
        .generate()
        .substring(0, 4)
        .toUpperCase()
        .replace(reg, "B");
    const uniqueCode = name + shortidcode;
    try {
        const verify = await Model.find({uniqueCode});
        if (verify.length) {
            return generateShortCode(name, Model);
        } else {
            return uniqueCode;
        }
    } catch (e) {
        console.log(e);
    }
};

export default generateShortCode