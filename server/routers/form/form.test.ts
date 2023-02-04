import { User } from "@clerk/nextjs/dist/api";
import { Mock } from "ts-mockery";
import { describe, it, expect } from "vitest";
import { Database } from "../../services/database";
import { Question } from "../question/question.schemas";
import { formRouter } from "./form.router";

describe("form router", () => {
  describe("create", () => {
    it("should throw an error if the user has more than 100 forms", async () => {
      const router = formRouter.createCaller({
        user: Mock.of<User>({ id: "fabien0102" }),
        db: Mock.of<Database>({
          async getFormsCount() {
            return 100;
          },
        }),
      });

      expect(() =>
        router.create({
          status: "draft",
          title: "test",
        })
      ).rejects.toThrowError("Limit of 100 forms reached!");
    });
  });

  describe("add question", () => {
    it("should throw if the form has more than 100 questions", async () => {
      const router = formRouter.createCaller({
        user: Mock.of<User>({ id: "fabien0102" }),
        db: Mock.of<Database>({
          async getQuestionsCount() {
            return 100;
          },
        }),
      });

      expect(() =>
        router.addQuestion({
          formId: "form-1",
          question: {
            type: "address",
            description: null,
            illustration: null,
            order: 0,
            title: "test",
          },
        })
      ).rejects.toThrowError("Limit of 100 questions/form reached!");
    });

    it("should throw if the order is off", async () => {
      const router = formRouter.createCaller({
        user: Mock.of<User>({ id: "fabien0102" }),
        db: Mock.of<Database>({
          async getQuestionsCount() {
            return 10;
          },
        }),
      });

      expect(() =>
        router.addQuestion({
          formId: "form-1",
          question: {
            type: "address",
            description: null,
            illustration: null,
            order: 0, // should be 10
            title: "test",
          },
        })
      ).rejects.toThrowError(
        "`question.order` is out of sync, should be 10 instead of 0"
      );
    });
  });

  describe("summary", () => {
    it("should fix the order if broken in db", async () => {
      const router = formRouter.createCaller({
        user: Mock.of<User>({ id: "fabien0102" }),
        db: Mock.of<Database>({
          async listQuestions() {
            return [mockQuestion(4), mockQuestion(2), mockQuestion(1)];
          },
        }),
      });

      const response = await router.summary({ formId: "form-1" });
      expect(response).toMatchInlineSnapshot(`
        [
          {
            "description": null,
            "id": "question-4",
            "illustration": null,
            "order": 0,
            "required": false,
            "title": "question 4",
            "type": "email",
          },
          {
            "description": null,
            "id": "question-2",
            "illustration": null,
            "order": 1,
            "required": false,
            "title": "question 2",
            "type": "email",
          },
          {
            "description": null,
            "id": "question-1",
            "illustration": null,
            "order": 2,
            "required": false,
            "title": "question 1",
            "type": "email",
          },
        ]
      `);
    });

    it("should return the db order if correct", async () => {
      const router = formRouter.createCaller({
        user: Mock.of<User>({ id: "fabien0102" }),
        db: Mock.of<Database>({
          async listQuestions() {
            return [mockQuestion(1), mockQuestion(0), mockQuestion(2)];
          },
        }),
      });

      const response = await router.summary({ formId: "form-1" });
      expect(response).toMatchInlineSnapshot(`
        [
          {
            "description": null,
            "id": "question-1",
            "illustration": null,
            "order": 1,
            "required": false,
            "title": "question 1",
            "type": "email",
          },
          {
            "description": null,
            "id": "question-0",
            "illustration": null,
            "order": 0,
            "required": false,
            "title": "question 0",
            "type": "email",
          },
          {
            "description": null,
            "id": "question-2",
            "illustration": null,
            "order": 2,
            "required": false,
            "title": "question 2",
            "type": "email",
          },
        ]
      `);
    });
  });
});

function mockQuestion(i: number): Question & { id: string } {
  return {
    id: `question-${i}`,
    type: "email",
    description: null,
    illustration: null,
    title: `question ${i}`,
    order: i,
    required: false,
  };
}
