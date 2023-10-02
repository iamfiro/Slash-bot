import { CommandInteraction } from "discord.js";
import prisma from "../lib/prisma";
import { User } from "@prisma/client";

// Check if user is already registered
export const checkAvailableUserRegister = async (
  userId: string,
  userName: string
): Promise<User> => {
  // Check if user is already registered
  const exists = await prisma.user.findFirst({
    where: { userId },
    include: {
      Economy: true
    }
  });
  // If not registered, register user
  if (exists === null) {
    const t = new Date();
    t.setDate(t.getDate() - 1);
    const data = await prisma.user.create({
      data: {
        userId,
        userName,
        Economy: {
          create: {
            userName,
            lastUsedDailyCommand: `${t.getFullYear()}${t.getMonth()}${t.getDate()}`,
          }
        }
      },
      include: {
        Economy: true
      }
    });
    return data
  }
  // If registered, return user data
  return exists;
};

// Get user data from ID
export const getUserById = async (userId: string): Promise<User | null> => {
  const data = await prisma.user.findUnique({
    where: {
      userId,
    },
  });
  return data;
};
