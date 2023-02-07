import { notExists } from "@xata.io/client";
import { z } from "zod";
import { getXataClient } from "../../utils/xata";
import { Form, formSchema } from "../routers/form/form.schemas";
import {
  Question,
  questionCommunProps,
  questionSchema,
  questionTypeSchema,
} from "../routers/question/question.schemas";

const xata = getXataClient();

const MAX_ITEMS = 100; // Hard limit to avoid abuse

export const database = {
  async getQuestion(
    questionId: string
  ): Promise<
    (Question & { id: string; userId: string; formId: string }) | null
  > {
    const raw = await xata.db.question.read(questionId);
    if (!raw) return null;

    const {
      type,
      userId,
      description,
      order,
      title,
      illustration,
      form,
      deletedAt,
    } = raw;

    const record: unknown = {
      type,
      userId,
      description,
      order,
      title,
      illustration,
      ...(raw as any)[type],
    };

    if (deletedAt) {
      throw new Error("The record has been deleted");
    }

    if (form === null) {
      throw new Error("Invalid record: `form` is null");
    }

    return {
      ...questionSchema.parse(record),
      userId,
      id: questionId,
      formId: form.id,
    };
  },

  async deleteQuestion(id: string) {
    await xata.db.question.update(id, {
      deletedAt: new Date(),
    });
    return id;
  },

  async getForm(
    formId: string,
    options: { skipDeleteCheck: boolean } = { skipDeleteCheck: false }
  ) {
    const raw = await xata.db.form.read(formId);

    if (!raw) return null;

    const { deletedAt, userId, id } = raw;

    if (deletedAt && !options.skipDeleteCheck) {
      throw new Error("The record has been deleted");
    }
    return { ...formSchema.parse(raw), userId, id };
  },

  async deleteForm(id: string) {
    await xata.db.form.update(id, {
      deletedAt: new Date(),
    });
    return id;
  },

  async undoDeleteForm(id: string) {
    await xata.db.form.update(id, {
      deletedAt: null,
    });
    return id;
  },

  async updateForm(id: string, payload: { title: string }) {
    const updatedRecord = await xata.db.form.update(id, {
      title: payload.title,
    });

    if (!updatedRecord) {
      return null;
    }

    return {
      id,
      ...formSchema.parse(updatedRecord),
    };
  },

  async updateQuestion({ id, question }: { id: string; question: Question }) {
    const { type, description, order, title, illustration, ...scopedProps } =
      question;

    const record = {
      type,
      description,
      order,
      title,
      illustration,
      updatedAt: new Date(),
      [question.type]: scopedProps,
    };

    await xata.db.question.update({ id, ...record });

    return { id, ...question };
  },

  async createQuestion(
    question: Question & { userId: string; formId: string }
  ) {
    const {
      type,
      userId,
      description,
      order,
      title,
      illustration,
      formId,
      ...scopedProps
    } = question;

    const record = {
      type,
      userId,
      description,
      order,
      title,
      illustration,
      form: formId, // link to the form
      [question.type]: scopedProps,
    };

    const createdRecord = await xata.db.question.create(record);

    return { question, id: createdRecord.id };
  },

  async createForm(form: Form & { userId: string }) {
    const createdRecord = await xata.db.form.create(form);
    return { ...form, id: createdRecord.id };
  },

  async listForms(props: {
    userId: string;
    filters?: { status: Form["status"] };
  }) {
    const { records } = await xata.db.form
      .filter(notExists("deletedAt"))
      .filter("userId", props.userId)
      .getPaginated({
        filter: props.filters,
        pagination: {
          size: MAX_ITEMS,
        },
      });

    const parsedRecords = z
      .array(
        formSchema.extend({
          id: z.string(),
        })
      )
      .parse(records);

    return parsedRecords;
  },

  async listQuestions(props: { formId: string; userId: string }) {
    const { records } = await xata.db.question
      .filter(notExists("deletedAt"))
      .filter("form", props.formId)
      .filter("userId", props.userId)
      .getPaginated({
        pagination: {
          size: MAX_ITEMS,
        },
        sort: {
          order: "asc",
        },
      });

    return z
      .array(
        questionCommunProps.extend({
          id: z.string(),
          type: questionTypeSchema,
        })
      )
      .parse(records);
  },

  async getFormsCount({ userId }: { userId: string }) {
    const {
      aggs: { count },
    } = await xata.db.form.aggregate({
      count: {
        count: {
          filter: {
            userId,
            $notExists: "deletedAt",
          },
        },
      },
    });

    return count;
  },

  async getQuestionsCount({
    formId,
    userId,
  }: {
    formId: string;
    userId: string;
  }) {
    const {
      aggs: { count },
    } = await xata.db.question.aggregate({
      count: {
        count: {
          filter: {
            form: formId,
            userId,
            $notExists: "deletedAt",
          },
        },
      },
    });

    return count;
  },

  createQuestions: (
    questions: Array<{
      title: string;
      type: string;
      form: string;
      userId: string;
      order: number;
    }>
  ) => xata.db.question.create(questions),
};

export type Database = typeof database;
