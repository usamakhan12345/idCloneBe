// middleware/tryAuth.js
import { User } from '../models/userModel.js'; // adjust as needed
import { decodeToken } from '../utils/apiHelper.js';

export const tryAuth = async (req, res, next) => {
    const token = req?.headers?.authorization?.split(" ")[1]
    try {
        if (token) {
            try {
                const decoded = decodeToken(token)

                const user = await User.findOne({ email: decoded.email })
                req.user = user;


            } catch (error) {
                req.user = null

            }
        }




        next();
    } catch (error) {
        res.status(401).send({ message: error.message });
    }
}
