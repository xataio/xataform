import { notExists } from "@xata.io/client";
import slugify from "slugify";
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
    const updatedQuestion = await xata.db.question.update(id, {
      deletedAt: new Date(),
    });

    if (updatedQuestion === null || updatedQuestion.form === null)
      throw new Error("The question wasn't deleted");

    // Recalculate the questions order
    const questions = await this.listQuestions({
      formId: updatedQuestion.form.id,
      userId: updatedQuestion.userId,
    });

    await xata.transactions.run([
      ...questions.map((q, order) => ({
        update: { table: "question" as const, id: q.id, fields: { order } },
      })),
      {
        update: {
          table: "form",
          id: updatedQuestion.form.id,
          fields: { status: "dirty" },
        },
      },
    ]);

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

    const q = await xata.db.question.update({ id, ...record });

    if (q && q.form)
      xata.db.form.update(q.form.id, { unpublishedChanges: { $increment: 1 } });

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
    xata.db.form.update(formId, { unpublishedChanges: { $increment: 1 } });

    return { question, id: createdRecord.id };
  },

  async createForm(form: Form & { userId: string }) {
    const createdRecord = await xata.db.form.create(form);
    return { ...form, id: createdRecord.id };
  },

  async createEnding({
    formId,
    title,
    subtitle,
    userId,
  }: {
    formId: string;
    title: string;
    subtitle?: string;
    userId: string;
  }) {
    const createdRecord = await xata.db.ending.create({
      form: formId,
      title,
      subtitle,
      userId,
    });

    return createdRecord;
  },

  async getEnding({ formId }: { formId: string }) {
    const ending = await xata.db.ending
      .filter({
        form: formId,
      })
      .getFirst();

    return z
      .object({
        id: z.string(),
        title: z.string().default("Thanks for everything"),
        subtitle: z.string().nullable().default(null),
      })
      .parse(ending);
  },

  async updateEnding({
    endingId,
    title,
    subtitle,
  }: {
    endingId: string;
    title: string;
    subtitle?: string;
  }) {
    const updatedRecord = await xata.db.ending.update(endingId, {
      title,
      subtitle,
    });

    if (updatedRecord && updatedRecord.form) {
      xata.db.form.update(updatedRecord.form.id, {
        unpublishedChanges: { $increment: 1 },
      });
    }

    return updatedRecord;
  },

  async publishForm({ formId, userId }: { formId: string; userId: string }) {
    // Mark the form as `live` and bump the version
    const updatedForm = await xata.db.form.update(formId, {
      status: "live",
      unpublishedChanges: 0,
      version: { $increment: 1 },
    });
    if (updatedForm === null) throw new Error("Form can't be publish");

    // Copy the questions to `publishedQuestions`
    const { records: questions } = await xata.db.question
      .filter(notExists("deletedAt"))
      .filter("form", formId)
      .filter("userId", userId)
      .getPaginated({
        pagination: {
          size: MAX_ITEMS,
        },
        sort: {
          order: "asc",
        },
      });

    await xata.db.publishedQuestion.create(
      questions.map(({ id, createdAt, updatedAt, deletedAt, ...i }) => ({
        ...i,
        version: updatedForm.version,
      }))
    );

    return { ...updatedForm };
  },

  async submitFormAnswers({
    formId,
    payload,
    version,
  }: {
    formId: string;
    version: number;
    payload: any;
  }) {
    await xata.db.answer.create({
      form: formId,
      payload: JSON.stringify(payload),
      version,
    });
    await xata.db.form.update(formId, {
      responses: { $increment: 1 },
    });
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

  async listPublishedForms() {
    const records = await xata.db.form
      .filter(notExists("deletedAt"))
      .filter({ status: "live" })
      .getAll();

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

  async listPublishedQuestions(props: { formId: string }) {
    const form = await xata.db.form.read(props.formId);
    if (form === null) throw new Error("Form not found!");
    const { records } = await xata.db.publishedQuestion
      .filter(notExists("deletedAt"))
      .filter("form", props.formId)
      .filter("form.status", "live")
      .filter("version", form.version)
      .getPaginated({
        pagination: {
          size: MAX_ITEMS,
        },
        sort: {
          order: "asc",
        },
      });

    return {
      version: form.version,
      questions: z
        .array(
          z.intersection(
            questionSchema,
            z.object({ questionId: z.string(), formId: z.string() })
          )
        )
        .parse(
          records.map((raw) => {
            const {
              type,
              userId,
              description,
              order,
              title,
              illustration,
              id,
            } = raw;

            const record: unknown = {
              questionId: id,
              formId: props.formId,
              type,
              userId,
              description,
              order,
              title,
              illustration,
              ...(raw as any)[type],
            };
            return record;
          })
        ),
    };
  },

  async previewForm({ formId, userId }: { formId: string; userId: string }) {
    const { records } = await xata.db.question
      .filter(notExists("deletedAt"))
      .filter("userId", userId)
      .filter("form", formId)
      .getPaginated({
        pagination: {
          size: MAX_ITEMS,
        },
        sort: {
          order: "asc",
        },
      });

    const ending = await this.getEnding({ formId });

    return {
      ending,
      questions: z
        .array(
          z.intersection(
            questionSchema,
            z.object({ questionId: z.string(), formId: z.string() })
          )
        )
        .parse(
          records.map((raw) => {
            const {
              type,
              userId,
              description,
              order,
              title,
              illustration,
              id,
            } = raw;

            const record: unknown = {
              questionId: id,
              formId,
              type,
              userId,
              description,
              order,
              title,
              illustration,
              ...(raw as any)[type],
            };
            return record;
          })
        ),
    };
  },

  async copyQuestions(props: {
    fromFormId: string;
    toFormId: string;
    userId: string;
  }) {
    const { records } = await xata.db.question
      .filter(notExists("deletedAt"))
      .filter("form", props.fromFormId)
      .filter("userId", props.userId)
      .getPaginated({
        pagination: {
          size: MAX_ITEMS,
        },
        sort: {
          order: "asc",
        },
      });

    await xata.db.question.create(
      records.map(({ id, form, createdAt, updatedAt, ...r }) => ({
        ...r,
        form: props.toFormId,
      }))
    );
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

  async createQuestions(
    questions: Array<{
      title: string;
      type: string;
      form: string;
      userId: string;
      order: number;
    }>
  ) {
    return xata.db.question.create(questions);
  },

  async updateQuestions(
    questions: Array<{
      id: string;
      order: number;
    }>,
    formId: string
  ) {
    xata.db.question.update(questions);
    xata.db.form.update(formId, { unpublishedChanges: { $increment: 1 } });
  },

  async listAnswers({ formId, version }: { version: number; formId: string }) {
    // Get columnDefs
    const questions = await xata.db.publishedQuestion
      .filter({
        version,
        form: formId,
      })
      .getAll();

    const columnDefs = questions.reduce((mem, question) => {
      const field = `${question.order}-${slugify(question.title, {
        lower: true,
        strict: true,
        trim: true,
      })}`;

      if (question.type === "contactInfo") {
        return [
          ...mem,
          { field: `${field}.firstName` },
          { field: `${field}.lastName` },
          { field: `${field}.phoneNumber` },
          { field: `${field}.email` },
          { field: `${field}.company` },
        ];
      }

      if (question.type === "address") {
        return [
          ...mem,
          { field: `${field}.address` },
          { field: `${field}.address2` },
          { field: `${field}.cityTown` },
          { field: `${field}.zipCode` },
          { field: `${field}.country` },
        ];
      }

      if (question.type === "matrix") {
        return [
          ...mem,
          ...(question?.matrix?.rows || [""]).reduce((def, row, i) => {
            return [
              ...def,
              {
                field: `${field}.${
                  row
                    ? slugify(row, {
                        lower: true,
                        strict: true,
                        trim: true,
                      })
                    : `row${i + 1}`
                }`,
              },
            ];
          }, [] as Array<{ field: string }>),
        ];
      }

      if (question.type === "date") {
        return [
          ...mem,
          {
            field,
            filter: "agDateColumnFilter",
          },
        ];
      }
      if (
        question.type === "number" ||
        question.type === "opinionScale" ||
        question.type === "ranking"
      ) {
        return [
          ...mem,
          {
            field,
            filter: "agNumberColumnFilter",
          },
        ];
      }

      return [
        ...mem,
        {
          field,
        },
      ];
    }, [] as Array<{ field: string; filter?: string }>);

    // Get answers
    const rowData = (
      await xata.db.answer.filter({ version, form: formId }).getAll()
    ).map((d) => {
      if (d.payload === null || d.payload === undefined) return {};
      try {
        return JSON.parse(d.payload);
      } catch {
        return {};
      }
    });

    console.log(rowData);

    return { columnDefs, rowData };
  },
};

export type Database = typeof database;

function valueOnly<T>(value: T | undefined): value is T {
  return Boolean(value);
}
