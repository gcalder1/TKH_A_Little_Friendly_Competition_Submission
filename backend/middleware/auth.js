import jwt from "jsonwebtoken";

export function authentication (request, response, next) {

    try {

        //grabbing what the user is using to try to req the info needed
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return response.status(401).json({
                error: "Missing authorization header"
            });
        }

        const token = authHeader.split(" ")[1]; //gets us their token

        //verifies JWT using Supabase JWT secret
        const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);

        //with that verification, the user can access corresponding info 
        //downstream
        request.user = decoded;

        next();

    } catch (error) {
        return response.status(401).json({
            error: "Invalid or expired token"
        });
    }
}