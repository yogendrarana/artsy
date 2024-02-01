import mongoose from 'mongoose';

export const connectDb = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.DATABASE_URI);
        console.log(`Database connected with ${connection.host}`);
    } catch (error) {
        console.log(error)
    }
}
