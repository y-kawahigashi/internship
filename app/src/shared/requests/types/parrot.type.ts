import z from "zod";

import { GetParrotParamsSchema } from "../schemas/parrot.schema";

export type GetParrotRequest = z.infer<typeof GetParrotParamsSchema>;
