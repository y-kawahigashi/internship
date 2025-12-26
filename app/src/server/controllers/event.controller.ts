import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { Events } from "@/generated/prisma";
import { BaseController } from "@/server/controllers/base.controller";
import { validateRequestBody } from "@/server/utils/validation";
import { CreateEventParamsSchema } from "@/shared/requests/schemas/event.schema";
import type { CreateEventRequest } from "@/shared/requests/types/event.type";
import { ErrorType } from "@/shared/response/enums/error-type.enum";
import type {
  CreateEventResponse,
  Event,
  SearchEventsResponse,
} from "@/shared/response/types/event.type";
import { createDate, isValidIso, now, parseIso, toIso } from "@/utils/date";

import { EventService } from "../services/event.service";

export class EventController extends BaseController {
  private eventService: EventService;

  constructor(eventService: EventService) {
    super();
    this.eventService = eventService;
  }

  /**
   * イベントを取得
   * @param request NextRequest
   * @returns NextResponse
   */
  async getEvents(
    request: NextRequest
  ): Promise<NextResponse<SearchEventsResponse>> {
    // 取得結果を返す
    const params = request.nextUrl.searchParams;
    const keyword = params.get("keyword") ?? "";
    const fields: Record<string, string> = {};
    const eventStartDatetime = params.get("eventStartDatetime");
    const eventEndDatetime = params.get("eventEndDatetime");
    const eventPlace = params.get("eventPlace");

    if (keyword.length > 50) {
      fields.keyword = "keyword must be 50 characters or less.";
    }

    if (eventStartDatetime && !isValidIso(eventStartDatetime)) {
      fields.eventStartDatetime =
        "eventStartDatetime must be in YYYY-MM-DDTHH:MM:SS.mmmZ format.";
    }
    if (eventStartDatetime && isValidIso(eventStartDatetime)) {
      const Date = parseIso(eventStartDatetime);
      const today = now();
      today.getFullYear();
      const tomorrow = createDate({
        params: {
          year: today.getFullYear(),
          monthIndex: today.getMonth(),
          day: today.getDate() + 1,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        },
      });
      if (tomorrow > Date) {
        fields.eventStartDatetime =
          "eventStartDatetime must be a date starting from tomorrow or later.";
      }
    }

    if (eventEndDatetime && !isValidIso(eventEndDatetime)) {
      fields.eventEndDatetime =
        "eventStartDatetime must be in YYYY-MM-DDTHH:MM:SS.mmmZ format.";
    }

    if (
      eventEndDatetime &&
      isValidIso(eventEndDatetime) &&
      eventStartDatetime &&
      isValidIso(eventStartDatetime)
    ) {
      const EndDate = parseIso(eventEndDatetime);
      const StartDate = parseIso(eventStartDatetime);
      if (StartDate > EndDate) {
        fields.eventEndDatetime =
          "eventEndDatetime must be the same as or later than eventStartDatetime.";
      }
    }

    const eventPlaceNumber = Number(eventPlace);
    if (isNaN(eventPlaceNumber)) {
      fields.eventPlace = "eventPlace must be a numeric value.";
    }

    if (Object.keys(fields).length > 0) {
      return NextResponse.json<SearchEventsResponse>(
        {
          error: {
            message: "Invalid query parameters",
            type: ErrorType.INVALID_PARAMETER,
            fields,
          },
        },
        { status: 400 }
      );
    }

    // イベントを取得
    const events = await this.eventService.getEvents();

    // PrismaのEvents型をEvent型に変換
    const data: Event[] = events.map(this.convertToEvent);

    // 取得結果を返す
    return NextResponse.json<SearchEventsResponse>({ data });
  }

  /**
   * イベントを作成
   * @param request NextRequest
   * @returns NextResponse
   */
  async createEvent(
    request: NextRequest
  ): Promise<NextResponse<CreateEventResponse>> {
    // リクエストを処理して結果を返す
    return this.handleRequest<Event>(request, async () => {
      // リクエストボディを検証
      const {
        name,
        description,
        eventStartDatetime,
        eventEndDatetime,
        capacity,
        prefecture,
        reward,
      } = await validateRequestBody<CreateEventRequest>(
        request,
        CreateEventParamsSchema
      );

      // イベントを作成
      const event = await this.eventService.createEvent({
        name,
        description: description ?? null,
        eventStartDatetime: parseIso(eventStartDatetime),
        eventEndDatetime: parseIso(eventEndDatetime),
        capacity,
        prefecture,
        reward,
      });

      // PrismaのEvents型をEvent型に変換
      const data: Event = this.convertToEvent(event);

      // 作成結果を返す
      return { data, status: 201 };
    });
  }

  private convertToEvent(event: Events): Event {
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      eventStartDatetime: toIso(event.eventStartDatetime),
      eventEndDatetime: toIso(event.eventEndDatetime),
      capacity: event.capacity,
      prefecture: event.prefecture,
      reward: event.reward,
      createdAt: toIso(event.createdAt),
      updatedAt: toIso(event.updatedAt),
    };
  }
}
