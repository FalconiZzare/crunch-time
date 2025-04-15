"use server";

import prisma from "@/lib/prisma";

export async function getDishes(type) {
  try {
    return await prisma.dish.findMany({
      where: {
        type: type
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error("Server error!");
  }
}
