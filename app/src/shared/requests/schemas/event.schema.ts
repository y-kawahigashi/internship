import z from "zod";

import { Prefecture } from "@/shared/common/enums/prefecture.enum";
import { Reward } from "@/shared/common/enums/reward.enum";

import { CommonSchema } from "./common.schema";

export const CreateEventParamsSchema = z
  .object({
    name: z.string().min(1).max(200),
    description: z.string().min(1).max(500).optional(),
    eventStartDatetime: CommonSchema.isoDatetimeString,
    eventEndDatetime: CommonSchema.isoDatetimeString,
    capacity: z.number().min(1),
    prefecture: z.enum(Prefecture, {
      error: (issue) => {
        if (issue.input === undefined) {
          return { message: "prefecture is required" };
        }
        return { message: "prefecture must be a valid enum value" };
      },
    }),
    reward: z
      .enum(Reward, {
        error: (issue) => {
          if (issue.input === undefined) {
            return { message: "reward is required" };
          }
          return { message: "reward must be a valid enum value" };
        },
      })
      .nullable(),
  })
  .superRefine(({ eventStartDatetime, eventEndDatetime }, ctx) => {
    if (
      eventStartDatetime &&
      eventEndDatetime &&
      eventStartDatetime >= eventEndDatetime
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["eventEndDatetime"],
        message: "eventEndDatetime must be after than eventStartDatetime",
      });
    }
  });
