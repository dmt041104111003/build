import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
    try {
        // eslint-disable-next-line no-undef
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
<<<<<<< HEAD
        console.log(process.env.CLERK_WEBHOOK_SECRET);
        // Verify request từ Clerk (Chú ý: không cần JSON.stringify)
        const payload = await whook.verify(req.body, {
=======
        
        await whook.verify(req.body, {
>>>>>>> 3a9f4401c0f6c7dcdfdef05bfe65ea86bc94f353
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });
        console.log("Raw Request Body:", req.body);


        const { data, type } = req.body;
        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address,
                    name: data.first_name+" "+data.last_name,
                    imageUrl: data.image_url,
                };
                await User.create(userData);
                res.json({})
                break;
            }

            case "user.updated": {
                const userData = {
                    email: data.email_address?.[0]?.email_address,
                    name: data.first_name+" "+data.last_name,
                    imageUrl: data.image_url,
                };
                await User.findByIdAndUpdate(data.id, userData);
                res.json({})
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                res.json({})
                break;
            }

            default:
                break;
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
