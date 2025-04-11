import { NextResponse } from "next/server";
import authMiddleware from "@/middlewares/authMiddleware";

export async function POST(req) {
    try {
        const user = await authMiddleware(req);
        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }
    }
}
