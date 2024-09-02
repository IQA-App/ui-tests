import { test, expect } from "@playwright/test";

test("should check response status", async ({ request }) => {
    const response = await request.get(process.env.API_BASE_URL + '/user');
    console.log(JSON.stringify(response))
    expect(response["_initializer"].status).toBe(200)
});