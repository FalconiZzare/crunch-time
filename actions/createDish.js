"use server";

import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function createDish(formData) {
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
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const file = formData.get("image");
    const type = formData.get("type");
    const blob = await put(file.name + new Date().toISOString(), file, {
      access: "public",
      allowOverwrite: true
    });

    await prisma.dish.create({
      data: {
        name: name,
        description: description,
        price: parseInt(price),
        image: blob.url,
        type: type
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error("Server Error!");
  }
}
