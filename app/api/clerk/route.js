// import { Webhook } from "svix";
// import connectDB from "@/config/db";
// import User from "@/models/User";
// import { headers } from "next/headers";
// import { NextRequest } from "next/server";

// export async function POST(req){
//     const wh = new Webhook(process.env.SIGNING_SECRET)
//     const headerPayload = await headers()
//     const svixHeaders = {
//         //Headers are important for database connectivity
//         "svix-id": headerPayload.get("svix-id"),
//         "svix-timestamp": headerPayload.get("svix-timestamp"),
//         "svix-signature": headerPayload.get("svix-signature"),
//     }

    
//     // Get the payload and verify it

//     const payload = await req.json();
//     const body = JSON.stringify(payload);
//     const {data, type}= wh.verify(body, svixHeaders)


//     // Prepare the user data to be saved in the database

//     const userData = {
//         _id: data.id,
//         email: data.email_addresses[0].email_address,
//         name: `${data.first_name} ${data.last_name}`,
//         image: data.image_url,
//     };

//     await connectDB(); 

//     switch (type) {
//         case 'user.created':
//             await User.create(userData)
//             break;

//         case 'user.updated':
//             await User.findByIdAndUpdate(data.id, userData)
//             break;
    
//         case 'user.deleted':
//             await User.findByIdAndDelete(data.id)
//             break;
    
//         default:
//             break;
//     }

//     return NextRequest.json({message: 'Event Received'});

// }




import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";

export async function POST(req) {
    const SIGNING_SECRET = process.env.SIGNING_SECRET;

    if (!SIGNING_SECRET) {
        console.error("❌ SIGNING_SECRET is missing");
        return new Response("Internal Server Error: Missing SIGNING_SECRET", { status: 500 });
    }

    const wh = new Webhook(SIGNING_SECRET);
    const headerPayload = headers(); // No need for `await`
    
    const svixHeaders = {
        "svix-id": headerPayload.get("svix-id"),
        "svix-timestamp": headerPayload.get("svix-timestamp"),
        "svix-signature": headerPayload.get("svix-signature"),
    };

    if (!svixHeaders["svix-id"] || !svixHeaders["svix-timestamp"] || !svixHeaders["svix-signature"]) {
        console.error("❌ Missing svix headers:", svixHeaders);
        return new Response("Bad Request: Missing headers", { status: 400 });
    }

    try {
        // Parse request body
        const payload = await req.json();
        const body = JSON.stringify(payload);
        const { data, type } = wh.verify(body, svixHeaders);

        // Prepare user data for the database
        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            name: `${data.first_name} ${data.last_name}`,
            image: data.image_url,
        };

        await connectDB();

        switch (type) {
            case "user.created":
                await User.create(userData);
                console.log("✅ User created:", userData);
                break;

            case "user.updated":
                await User.findByIdAndUpdate(data.id, userData);
                console.log("✅ User updated:", userData);
                break;

            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                console.log("❌ User deleted:", data.id);
                break;

            default:
                console.log("Unhandled event type:", type);
                break;
        }

        return Response.json({ message: "Event Received" });
    } catch (error) {
        console.error("❌ Error processing webhook:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
