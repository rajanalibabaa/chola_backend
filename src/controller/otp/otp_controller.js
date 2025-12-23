import { Registration } from "../../model/registraionSchema_model.js";


export const generateOtp = async () => {
    const email = req.body.email || req.query.email

    const exists = await Registration.findOne({email})

    if (!exists) {
        
    }
};
export const verifyOtp = async () => {};
export const resendOtp = async () => {};
