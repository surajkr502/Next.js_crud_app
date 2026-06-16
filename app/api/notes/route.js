import dbConnect from "@/lib/db";
import Note from "@/models/Note";

import { NextResponse } from "next/server";


export async function GET() {
    try {
        await dbConnect()
        const notes = await Note.find({}).sort({createdAt:-1})

        return NextResponse.json({success:true , data:notes})
    } catch (error) {
         return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
    }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const note = await Note.create(body);
    console.log(body)

    return NextResponse.json({ success: true, data: body }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}