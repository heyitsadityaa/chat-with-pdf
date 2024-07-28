"use server";
import { Message } from "@/components/Chat";
import { adminDb } from "@/firebaseAdmin";
// import { FREE_LIMIT, PRO_LIMIT } from "@/hooks/useSubscriptions";
import { generateLangchainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
// import {generateLangchainCompletion} from '@/lib/langchain'

const PRO_LIMIT = 20;
const FREE_LIMIT = 2;

export async function askQuestion(id: string, question: string) {
  auth().protect();
  const { userId } = await auth();

  const chatRef = adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .collection("chat");

  const chatSnapshot = await chatRef.get();
  const userMessages = chatSnapshot.docs.filter(
    (doc) => doc.data().role === "human"
  );

  // Check membership limits for messages in a document
  const userRef = await adminDb.collection("users").doc(userId!).get();

  //  limit the PRO/FREE users

  // Check if user is on FREE plan and has asked more than the FREE number of questions.
  if (!userRef.data()?.hasActiveMembership) {
    if (userMessages.length >= FREE_LIMIT) {
      return {
        success: false,
        message: `You'll need to upgrade to PRO to ask more than ${FREE_LIMIT} question!`,
      };
    }
  }

  // Check if user is on PRO plan and has asked more than 100 questions
  if (!userRef.data()?.hasActiveMembership) {
    if (userMessages.length >= PRO_LIMIT) {
      return {
        success: false,
        message: `You've reached the PRO limit of ${PRO_LIMIT} question per document!`,
      };
    }
  }

  const userMessage: Message = {
    role: "human",
    message: question,
    createdAt: new Date(),
  };
  await chatRef.add(userMessage);

  //   Generate the AI response
  const reply = await generateLangchainCompletion(id, question);

  const aiMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };

  await chatRef.add(aiMessage);

  return { success: true, message: null };
}
