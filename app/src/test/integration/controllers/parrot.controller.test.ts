import { NextRequest } from "next/server";

import { GET } from "@/app/api/parrot/route";
import { ErrorType } from "@/shared/response/enums/error-type.enum";

describe("ParrotController", () => {
  describe("GET /api/parrot", () => {
    it("メッセージをオウム返しできること", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/parrot?message=Hi!",
        { method: "GET" }
      );

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({
        data: {
          message: "Hi!",
        },
      });
    });
    it("messageが未指定の場合", async () => {
      const request = new NextRequest("http://localhost:3000/api/parrot", {
        method: "GET",
      });
      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBeDefined();
      expect(body.error.message).toBe("Invalid query parameters");
      expect(body.error.type).toBe(ErrorType.INVALID_PARAMETER);
      expect(body.error.fields).toBeDefined();
      expect(body.error.fields.message).toBe("message is required");
    });
    it("messageが空文字列の場合", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/parrot?message=",
        {
          method: "GET",
        }
      );
      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBeDefined();
      expect(body.error.message).toBe("Invalid query parameters");
      expect(body.error.type).toBe(ErrorType.INVALID_PARAMETER);
      expect(body.error.fields).toBeDefined();
      expect(body.error.fields.message).toBe(
        "message must be at least 1 character"
      );
    });
    it("messageが20文字を超える場合", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/parrot?message=000001010011100101110111",
        {
          method: "GET",
        }
      );
      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBeDefined();
      expect(body.error.message).toBe("Invalid query parameters");
      expect(body.error.type).toBe(ErrorType.INVALID_PARAMETER);
      expect(body.error.fields).toBeDefined();
      expect(body.error.fields.message).toBe(
        "message must be at most 20 characters"
      );
    });
  });
});
