import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
// import { error } from "console";
// import { connect } from "http2";
import { NextResponse } from "next/server";


//Configure Cloudinary
cloudinary.config(
    {
        cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
        api_key : process.env.CLOUDINARY_API_KEY,
        api_secret : process.env.CLOUDINARY_API_SECRET
    }
)

export async function POST(request) {
    try {
        const  { userId } = getAuth(request)

        const isAdmin = await authSeller(userId)

        if (!isAdmin) {
            return NextResponse.json({ success: false, message: 'not authorized' })
        }

        const formData = await request.formData()

        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const color = formData.get('color');
        const brand = formData.get('brand');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');

        const files = formData.getAll('images');

        if (!files || files.length === 0 ) {
            return NextResponse.json({ success: false, message: 'No Files Uploaded!' })
        }

        const result = await Promise.all(
            files.map(async (file) =>{
                const arrayBufer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBufer)

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {resource_type : 'auto'},
                        (error,result) => {
                            if (error) {
                                reject(error)
                            } else {
                                resolve(result)
                            }
                        }
                    )
                    stream.end(buffer)
                })
            })
        )

        const image = result.map( result => result.secure_url )

        await connectDB()
        const newProduct = await Product.create({
        userId,
        name,
        description,
        category,
        price : Number(price),
        offerPrice : Number(offerPrice),
        color,
        image,
        brand,
        date: Date.now()
        })

        return NextResponse.json({ success : true, message: 'Upload successful', newProduct})
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }    
}