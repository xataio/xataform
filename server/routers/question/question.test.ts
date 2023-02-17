import { User } from "@clerk/nextjs/dist/api";
import { Mock } from "ts-mockery";
import { describe, expect, it, vitest } from "vitest";
import { Database } from "../../services/database";
import { questionRouter } from "./question.router";
import { Question, QuestionOfType } from "./question.schemas";

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

    describe("multipleChoice", () => {
      const getMultipleChoice = (options: {
        limitMin?: number;
        limitMax?: number;
        choicesCount: number;
      }) =>
        questionRouter
          .createCaller({
            user: Mock.of<User>({ id: "fabien0102" }),
            db: Mock.of<Database>({
              getQuestion: async () => {
                return {
                  id: "test",
                  type: "multipleChoice",
                  formId: "test",
                  description: null,
                  illustration: null,
                  order: 0,
                  otherOption: false,
                  randomize: false,
                  required: false,
                  title: "Multiple choice",
                  userId: "fabien0102",
                  choices: new Array(options.choicesCount)
                    .fill("choice ")
                    .map((i, index) => `${i} ${index}`),
                  limitMax: options.limitMax,
                  limitMin: options.limitMin,
                } satisfies QuestionOfType<"multipleChoice"> & {
                  id: string;
                  userId: string;
                  formId: string;
                };
              },
            }),
          })
          .get({ questionId: "text" });

      it("should cap the limitMax to choices length", async () => {
        const question = await getMultipleChoice({
          choicesCount: 10,
          limitMax: 20,
        });

        if (question.type !== "multipleChoice")
          throw new Error("Should be multiple choice question");

        expect(question.limitMax).toBe(10);
      });

      it("should cap the limitMin to limitMax", async () => {
        const question = await getMultipleChoice({
          choicesCount: 10,
          limitMax: 5,
          limitMin: 10,
        });

        if (question.type !== "multipleChoice")
          throw new Error("Should be multiple choice question");

        expect(question.limitMax).toBe(5);
        expect(question.limitMin).toBe(5);
      });

      it("should cap the limitMin & limitMax to choices length", async () => {
        const question = await getMultipleChoice({
          choicesCount: 1,
          limitMax: 5,
          limitMin: 10,
        });

        if (question.type !== "multipleChoice")
          throw new Error("Should be multiple choice question");

        expect(question.limitMax).toBe(1);
        expect(question.limitMin).toBe(1);
      });

      it("should remove negative values", async () => {
        const question = await getMultipleChoice({
          choicesCount: 10,
          limitMax: -5,
          limitMin: -10,
        });

        if (question.type !== "multipleChoice")
          throw new Error("Should be multiple choice question");

        expect(question.limitMax).toBe(0);
        expect(question.limitMin).toBe(0);
      });

      it("should returns legit values", async () => {
        const question = await getMultipleChoice({
          choicesCount: 10,
          limitMax: 8,
          limitMin: 2,
        });

        if (question.type !== "multipleChoice")
          throw new Error("Should be multiple choice question");

        expect(question.limitMax).toBe(8);
        expect(question.limitMin).toBe(2);
      });

      it("should returns min only", async () => {
        const question = await getMultipleChoice({
          choicesCount: 10,
          limitMin: 2,
        });

        if (question.type !== "multipleChoice")
          throw new Error("Should be multiple choice question");

        expect(question.limitMin).toBe(2);
      });
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

          if (id === "lastQuestion") {
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
              formId: "lastQuestion",
            };
          }

          return null;
        },
        deleteQuestion: async (id: string) => id,
        getQuestionsCount: async ({ formId }) => {
          if (formId === "lastQuestion") return 1;
          return 10;
        },
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

    it("should throw PRECONDITION_FAILED if this is the last question", async () => {
      expect(() =>
        router.delete({ questionId: "lastQuestion" })
      ).rejects.toThrowError("You can't delete the last question");
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
        router.update({ questionId: "notfound", question: nextQuestion })
      ).rejects.toThrowError("NOT_FOUND");
    });

    it("should throws FORBIDDEN if the user doesn't match", async () => {
      expect(() =>
        router.update({ questionId: "somebody", question: nextQuestion })
      ).rejects.toThrowError("FORBIDDEN");
    });

    it("should throws CONFLICT if the order doesn't match", async () => {
      expect(() =>
        router.update({
          questionId: "found",
          question: { ...nextQuestion, order: 42 },
        })
      ).rejects.toThrowError(
        "Please use the specialized `question.reorder` method"
      );
    });

    it("should update the record", async () => {
      await router.update({ questionId: "found", question: nextQuestion });
      expect(updateQuestion).toBeCalledWith({
        id: "found",
        question: nextQuestion,
      });
    });
  });
});
