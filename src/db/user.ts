import { CommandInteraction } from "discord.js";
import prisma from "../lib/prisma";
import { User } from "@prisma/client";

export const checkAvailableUserRegister = async (
  interaction: CommandInteraction
): Promise<User | null> => {
  const exists = await prisma.user.findFirst({
    where: { userId: interaction.user.id },
  });
  if (exists === null) {
    const t = new Date();
    t.setHours(t.getHours() + 9);
    t.setDate(t.getDate() - 1);
    const data = await prisma.user.create({
      data: {
        userId: interaction.user.id,
        userName: interaction.user.username,
      },
    });
    return data
  }
  return exists;
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const data = await prisma.user.findUnique({
    where: {
      userId,
    },
  });
  return data;
};
