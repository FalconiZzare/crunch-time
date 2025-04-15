"use server";

import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function createDish(data, formData) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    throw new Error("Session not found!");
  }

  if (session.user.role !== "admin") {
    throw new Error("Unauthorized!");
  }

  try {
    const file = formData.get("image");
    const blob = await put(file.name, file, {
      access: "public",
      allowOverwrite: true
    });

    await prisma.dish.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseInt(data.price),
        image: blob.url,
        type: data.type
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error("Server Error!");
  }
}
