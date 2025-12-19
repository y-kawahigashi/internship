import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { BaseController } from "@/server/controllers/base.controller";
import { ErrorType } from "@/shared/response/enums/error-type.enum";
import type { ParrotResponse } from "@/shared/response/types/parrot.type";

export class ParrotController extends BaseController {
  constructor() {
    super();
  }

  async getParrot(request: NextRequest): Promise<NextResponse<ParrotResponse>> {
    const { searchParams } = new URL(request.url);
    const message = searchParams.get("message");

    if (message === null) {
      return NextResponse.json<ParrotResponse>(
        {
          error: {
            message: "Invalid query parameters",
            type: ErrorType.INVALID_PARAMETER,
            fields: {
              message: "message is required",
            },
          },
        },
        { status: 400 }
      );
    } else if (message.length < 1) {
      return NextResponse.json<ParrotResponse>(
        {
          error: {
            message: "Invalid query parameters",
            type: ErrorType.INVALID_PARAMETER,
            fields: {
              message: "message must be at least 1 character",
            },
          },
        },
        { status: 400 }
      );
    } else if (message.length > 20) {
      return NextResponse.json<ParrotResponse>(
        {
          error: {
            message: "Invalid query parameters",
            type: ErrorType.INVALID_PARAMETER,
            fields: {
              message: "message must be at most 20 characters",
            },
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ParrotResponse>(
      {
        data: {
          message: message ?? "",
        },
      },
      { status: 200 }
    );
  }
}
