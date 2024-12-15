import { getFilamentByName, incrementFilamentStock, updateFilament } from "@/lib/db/schema/filaments";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

enum OperationType {
    ADD = 'add',
    SUBTRACT = 'subtract',
    SET = 'set'
}

const putSchema = z.object({
    id: z.number().step(1),
    operation: z.nativeEnum(OperationType),
    amount: z.number().step(1),
});

export async function PUT (request: NextRequest) {
    try {
        const jsonBody = request.json();

        const typedBody = putSchema.parse(jsonBody);

        let amount = typedBody.amount;

        switch(typedBody.operation)
        {
            case OperationType.SUBTRACT:
                amount *= -1;
            case OperationType.ADD:
                await incrementFilamentStock(typedBody.id, amount);
                break;
            case OperationType.SET:
                await updateFilament(typedBody.id, { stock: amount });
                break;
            default:
                break;
        }

        return NextResponse.json({success: true});

    } catch (e) {
        const error = e as Error;
        return NextResponse.json({error: error.message}, { status: 400 });
    }
}

export async function GET (request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const name = searchParams.get('name');

        if (!name) {
            return NextResponse.json({ error: 'Name parameter is required' }, { status: 400 });
        }

        const filament = await getFilamentByName(name);

        return NextResponse.json({
            success: filament.found,
            filament: filament.data
        });
    } catch (e) {
        const error = e as Error;
        return NextResponse.json({error: error.message}, { status: 400 });
    }
}