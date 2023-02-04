import { User } from "@clerk/nextjs/dist/api";
import { Mock } from "ts-mockery";
import { describe, expect, it, vitest } from "vitest";
import { Database } from "../../services/database";
import { questionRouter } from "./question.router";
import { Question } from "./question.schemas";

describe("question router", () => {
  describe("get", () => {
    const router = questionRouter.createCaller({
      user: Mock.of<User>({ id: "fabien0102" }),
      db: Mock.of<Database>({
        getQuestion: async (id) => {
          if (id === "found") {
            return {
              id,
              type: "shortText",
              title: "Question",
              order: 0,
              maxLength: null,
              required: false,
              description: null,
              illustration: null,
              userId: "fabien0102",
              formId: "form01",
            };
          }

          if (id === "somebody") {
            return {
              id,
              type: "shortText",
              title: "Question",
              order: 0,
              maxLength: null,
              required: false,
              description: null,
              illustration: null,
              userId: "somebody",
              formId: "form01",
            };
          }

          return null;
        },
      }),
    });

    it("should get the question from the database", async () => {
      const response = await router.get({ questionId: "found" });

      expect(response).toEqual({
        id: "found",
        type: "shortText",
        title: "Question",
        order: 0,
        maxLength: null,
        required: false,
        description: null,
        illustration: null,
        formId: "form01",
      });
    });

    it("should throw NOT_FOUND if no question found", async () => {
      expect(() => router.get({ questionId: "notfound" })).rejects.toThrowError(
        "NOT_FOUND"
      );
    });

    it("should throw NOT_FOUND if the question is not from the user", () => {
      expect(() => router.get({ questionId: "somebody" })).rejects.toThrowError(
        "NOT_FOUND"
      );
    });
  });

  describe("delete", () => {
    const router = questionRouter.createCaller({
      user: Mock.of<User>({ id: "fabien0102" }),
      db: Mock.of<Database>({
        getQuestion: async (id) => {
          if (id === "found") {
            return {
              id,
              type: "shortText",
              title: "Question",
              order: 0,
              maxLength: null,
              required: false,
              description: null,
              illustration: null,
              userId: "fabien0102",
              formId: "form01",
            };
          }

          if (id === "somebody") {
            return {
              id,
              type: "shortText",
              title: "Question",
              order: 0,
              maxLength: null,
              required: false,
              description: null,
              illustration: null,
              userId: "somebody",
              formId: "form01",
            };
          }

          return null;
        },
        deleteQuestion: async (id: string) => id,
      }),
    });

    it("should delete the question", async () => {
      const response = await router.delete({ questionId: "found" });

      expect(response).toEqual({
        questionId: "found",
        deleted: true,
      });
    });

    it("should throw NOT_FOUND if no question found", async () => {
      expect(() =>
        router.delete({ questionId: "notfound" })
      ).rejects.toThrowError("NOT_FOUND");
    });

    it("should throw NOT_FOUND if the question is not from the user", async () => {
      expect(() =>
        router.delete({ questionId: "somebody" })
      ).rejects.toThrowError("NOT_FOUND");
    });
  });

  describe("update", () => {
    const nextQuestion: Question = {
      type: "shortText",
      title: "Next question",
      order: 0,
      maxLength: null,
      required: false,
      description: null,
      illustration: null,
    };

    const updateQuestion = vitest.fn();

    const router = questionRouter.createCaller({
      user: Mock.of<User>({ id: "fabien0102" }),
      db: Mock.of<Database>({
        getQuestion: async (id) => {
          if (id === "found") {
            return {
              id,
              type: "shortText",
              title: "Question",
              order: 0,
              maxLength: null,
              required: false,
              description: null,
              illustration: null,
              userId: "fabien0102",
              formId: "form01",
            };
          }

          if (id === "somebody") {
            return {
              id,
              type: "shortText",
              title: "Question",
              order: 0,
              maxLength: null,
              required: false,
              description: null,
              illustration: null,
              userId: "somebody",
              formId: "form01",
            };
          }

          return null;
        },
        updateQuestion,
      }),
    });

    it("should throws NOT_FOUND if the question doesn't exist", async () => {
      expect(() =>
        router.update({ id: "notfound", question: nextQuestion })
      ).rejects.toThrowError("NOT_FOUND");
    });

    it("should throws FORBIDDEN if the user doesn't match", async () => {
      expect(() =>
        router.update({ id: "somebody", question: nextQuestion })
      ).rejects.toThrowError("FORBIDDEN");
    });

    it("should throws CONFLICT if the order doesn't match", async () => {
      expect(() =>
        router.update({ id: "found", question: { ...nextQuestion, order: 42 } })
      ).rejects.toThrowError(
        "Please use the specialized `question.reorder` method"
      );
    });

    it("should update the record", async () => {
      await router.update({ id: "found", question: nextQuestion });
      expect(updateQuestion).toBeCalledWith({
        id: "found",
        question: nextQuestion,
      });
    });
  });
});
