import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { passkey } from "better-auth/plugins/passkey";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    }
  },
  advanced: {
    cookiePrefix: "crunch-time"
  },
  user: {
    additionalFields: {
      role: {
        type: ["admin", "customer", "chef", "delivery"],
        default: ["customer"],
        required: true,
        input: false
      }
    }
  },
  plugins: [passkey(), nextCookies()]
});
