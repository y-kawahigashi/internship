import "@/server/dependencies";

import type { NextRequest } from "next/server";

import { container } from "@/server/container";
import { ParrotController } from "@/server/controllers/parrot.controller";

export async function GET(request: NextRequest) {
  const parrotController = container.resolve(ParrotController);
  return parrotController.getParrot(request);
}
