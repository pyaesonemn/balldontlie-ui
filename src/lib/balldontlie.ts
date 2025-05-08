import { BalldontlieAPI } from "@balldontlie/sdk";

export const balldontlie = new BalldontlieAPI({
  apiKey: process.env.BALLDONTLIE_API_KEY || "",
});
