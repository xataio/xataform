import { describe, it, expect } from "vitest";
import { applyRules, fromXataRecords, toXataRecords } from "./logic.utils";
import { Logic, Rules } from "./logic.schemas";

describe("logic", () => {
  describe("fromXataRecords", () => {
    it("should format Xata records to the desire format", () => {
      const payload = [
        {
          action: "jump",
          id: "rec_h8OUvqPRoVlFl6V5LXRw",
          key: "address2",
          operation: "equal",
          parentRule: { id: "rec_lwnBj_nZQD_a9M-9bRQx" },
          question: { id: "rec_ch19t3k2ii7a84d31ih0", type: "shortText" },
          to: { id: "rec_ch19tkhulq3pip75p77g" },
          value: "test2",
        },
        {
          action: "jump",
          id: "rec_iLRqE1l6n02se2nC3E5C",
          key: "address",
          operation: "equal",
          parentRule: { id: "rec_lwnBj_nZQD_a9M-9bRQx" },
          question: { id: "rec_ch19t3k2ii7a84d31ih0", type: "shortText" },
          to: { id: "rec_ch19tkhulq3pip75p77g" },
          value: "test",
        },
        {
          id: "rec_lwnBj_nZQD_a9M-9bRQx",
          operation: "and",
          question: { id: "rec_ch19t3k2ii7a84d31ih0", type: "shortText" },
          value: null,
          key: null,
          to: null,
          action: null,
          parentRule: null,
        },
      ];

      expect(fromXataRecords(payload)).toMatchInlineSnapshot(`
        {
          "rec_ch19t3k2ii7a84d31ih0": [
            {
              "operation": "and",
              "rules": [
                {
                  "action": "jump",
                  "operation": "equal",
                  "questionType": "shortText",
                  "to": "rec_ch19tkhulq3pip75p77g",
                  "value": "test2",
                },
                {
                  "action": "jump",
                  "operation": "equal",
                  "questionType": "shortText",
                  "to": "rec_ch19tkhulq3pip75p77g",
                  "value": "test",
                },
              ],
            },
          ],
        }
      `);
    });
  });

  describe("toXataRecords", () => {
    it("should convert the object to Xata records", () => {
      const payload: Logic[number] = [
        {
          action: "jump",
          operation: "equal",
          questionType: "shortText",
          to: "rec_cgrrvjrtjl4ls8qjfmcg",
          value: "a value",
        },
        {
          action: "jump",
          operation: "equal",
          questionType: "shortText",
          to: "rec_cgrrvjrtjl4ls8qjfmcg",
          value: "another value",
        },
        {
          rules: [
            {
              action: "jump",
              operation: "equal",
              questionType: "shortText",
              to: "rec_cgrrvjrtjl4ls8qjfmcg",
              value: "and 1",
            },
            {
              action: "jump",
              operation: "equal",
              questionType: "shortText",
              to: "rec_cgrrvjrtjl4ls8qjfmcg",
              value: "and 2",
            },
          ],
          operation: "and",
        },
      ];

      const result = toXataRecords(payload, "my-question-id");

      expect(result.length).toBe(5);

      expect(result[0]).toMatchObject({
        id: expect.any(String),
        key: undefined,
        operation: "equal",
        question: "my-question-id",
        to: "rec_cgrrvjrtjl4ls8qjfmcg",
        value: "a value",
      });

      expect(result[1]).toMatchObject({
        id: expect.any(String),
        key: undefined,
        operation: "equal",
        question: "my-question-id",
        to: "rec_cgrrvjrtjl4ls8qjfmcg",
        value: "another value",
        action: "jump",
      });

      expect(result[2]).toMatchObject({
        id: expect.any(String),
        operation: "and",
        question: "my-question-id",
      });

      expect(result[3]).toMatchObject({
        id: expect.any(String),
        operation: "equal",
        parentRule: result[2].id,
        question: "my-question-id",
        to: "rec_cgrrvjrtjl4ls8qjfmcg",
        value: "and 1",
        action: "jump",
      });

      expect(result[4]).toMatchObject({
        id: expect.any(String),
        operation: "equal",
        parentRule: result[2].id,
        question: "my-question-id",
        to: "rec_cgrrvjrtjl4ls8qjfmcg",
        value: "and 2",
        action: "jump",
      });
    });
  });

  describe("applyRules", () => {
    (
      [
        // ---- strings
        {
          name: "shortText equal",
          rules: [
            {
              action: "jump",
              questionType: "shortText",
              operation: "equal",
              value: "success",
              to: "next-question",
            },
          ],
          answer: "success",
          expected: "next-question",
        },
        {
          name: "shortText equal",
          rules: [
            {
              action: "jump",
              questionType: "shortText",
              operation: "equal",
              value: "success",
              to: "next-question",
            },
          ],
          answer: "different",
          expected: null,
        },
        {
          name: "shortText notEqual",
          rules: [
            {
              action: "jump",
              questionType: "shortText",
              operation: "notEqual",
              value: "success",
              to: "next-question",
            },
          ],
          answer: "different",
          expected: "next-question",
        },
        {
          name: "shortText notEqual",
          rules: [
            {
              action: "jump",
              questionType: "shortText",
              operation: "notEqual",
              value: "same",
              to: "next-question",
            },
          ],
          answer: "same",
          expected: null,
        },
        {
          name: "shortText beginsWith",
          rules: [
            {
              action: "jump",
              questionType: "shortText",
              operation: "beginsWith",
              value: "success",
              to: "next-question",
            },
          ],
          answer: "successful",
          expected: "next-question",
        },
        {
          name: "shortText beginsWith",
          rules: [
            {
              action: "jump",
              questionType: "shortText",
              operation: "beginsWith",
              value: "nop",
              to: "next-question",
            },
          ],
          answer: "this is not starting well",
          expected: null,
        },
        {
          name: "shortText endsWith",
          rules: [
            {
              action: "jump",
              questionType: "shortText",
              operation: "endsWith",
              value: "ful",
              to: "next-question",
            },
          ],
          answer: "successful",
          expected: "next-question",
        },
        {
          name: "shortText endsWith",
          rules: [
            {
              action: "jump",
              questionType: "shortText",
              operation: "endsWith",
              value: "nop",
              to: "next-question",
            },
          ],
          answer: "this is not starting well",
          expected: null,
        },
        {
          name: "shortText contains",
          rules: [
            {
              action: "jump",
              questionType: "shortText",
              operation: "contains",
              value: "chocolate",
              to: "next-question",
            },
          ],
          answer: "I like chocolate",
          expected: "next-question",
        },
        {
          name: "shortText contains",
          rules: [
            {
              action: "jump",
              questionType: "shortText",
              operation: "contains",
              value: "chocolate",
              to: "next-question",
            },
          ],
          answer: "I don't like anything",
          expected: null,
        },
        {
          name: "shortText notContains",
          rules: [
            {
              action: "jump",
              questionType: "shortText",
              operation: "notContains",
              value: "chocolate",
              to: "next-question",
            },
          ],
          answer: "Nahhh!",
          expected: "next-question",
        },
        {
          name: "shortText notContains",
          rules: [
            {
              action: "jump",
              questionType: "shortText",
              operation: "notContains",
              value: "chocolate",
              to: "next-question",
            },
          ],
          answer: "Chocolate!!! Why not?!",
          expected: null,
        },
        // ---- numbers
        {
          name: "number equal",
          rules: [
            {
              action: "jump",
              questionType: "number",
              operation: "equal",
              value: 42,
              to: "next-question",
            },
          ],
          answer: 42,
          expected: "next-question",
        },
        {
          name: "number equal",
          rules: [
            {
              action: "jump",
              questionType: "number",
              operation: "equal",
              value: 42,
              to: "next-question",
            },
          ],
          answer: 1337,
          expected: null,
        },
        {
          name: "number notEqual",
          rules: [
            {
              action: "jump",
              questionType: "number",
              operation: "notEqual",
              value: 42,
              to: "next-question",
            },
          ],
          answer: 1337,
          expected: "next-question",
        },
        {
          name: "number notEqual",
          rules: [
            {
              action: "jump",
              questionType: "number",
              operation: "notEqual",
              value: 42,
              to: "next-question",
            },
          ],
          answer: 42,
          expected: null,
        },
        {
          name: "number lowerThan",
          rules: [
            {
              action: "jump",
              questionType: "number",
              operation: "lowerThan",
              value: 42,
              to: "next-question",
            },
          ],
          answer: 41,
          expected: "next-question",
        },
        {
          name: "number lowerThan",
          rules: [
            {
              action: "jump",
              questionType: "number",
              operation: "lowerThan",
              value: 42,
              to: "next-question",
            },
          ],
          answer: 42,
          expected: null,
        },
        {
          name: "number lowerEqualThan",
          rules: [
            {
              action: "jump",
              questionType: "number",
              operation: "lowerEqualThan",
              value: 42,
              to: "next-question",
            },
          ],
          answer: 41,
          expected: "next-question",
        },
        {
          name: "number lowerEqualThan",
          rules: [
            {
              action: "jump",
              questionType: "number",
              operation: "lowerEqualThan",
              value: 42,
              to: "next-question",
            },
          ],
          answer: 42,
          expected: "next-question",
        },
        {
          name: "number lowerEqualThan",
          rules: [
            {
              action: "jump",
              questionType: "number",
              operation: "lowerEqualThan",
              value: 42,
              to: "next-question",
            },
          ],
          answer: 43,
          expected: null,
        },
        {
          name: "number greaterThan",
          rules: [
            {
              action: "jump",
              questionType: "number",
              operation: "greaterThan",
              value: 42,
              to: "next-question",
            },
          ],
          answer: 43,
          expected: "next-question",
        },
        {
          name: "number greaterThan",
          rules: [
            {
              action: "jump",
              questionType: "number",
              operation: "greaterThan",
              value: 42,
              to: "next-question",
            },
          ],
          answer: 42,
          expected: null,
        },
        {
          name: "number greaterEqualThan",
          rules: [
            {
              action: "jump",
              questionType: "number",
              operation: "greaterEqualThan",
              value: 42,
              to: "next-question",
            },
          ],
          answer: 43,
          expected: "next-question",
        },
        {
          name: "number greaterEqualThan",
          rules: [
            {
              action: "jump",
              questionType: "number",
              operation: "greaterEqualThan",
              value: 42,
              to: "next-question",
            },
          ],
          answer: 42,
          expected: "next-question",
        },
        {
          name: "number greaterEqualThan",
          rules: [
            {
              action: "jump",
              questionType: "number",
              operation: "greaterEqualThan",
              value: 42,
              to: "next-question",
            },
          ],
          answer: 41,
          expected: null,
        },
        {
          name: "date on",
          rules: [
            {
              action: "jump",
              questionType: "date",
              operation: "on",
              value: "1989-02-01T00:00:00.000Z",
              to: "happy-birthday",
            },
          ],
          answer: "1989-02-01T00:00:00.000Z",
          expected: "happy-birthday",
        },
        {
          name: "date on",
          rules: [
            {
              action: "jump",
              questionType: "date",
              operation: "on",
              value: "1989-02-01T00:00:00.000Z",
              to: "happy-birthday",
            },
          ],
          answer: "1989-02-12T00:00:00.000Z",
          expected: null,
        },
        {
          name: "date notOn",
          rules: [
            {
              action: "jump",
              questionType: "date",
              operation: "notOn",
              value: "2020-02-01T00:00:00.000Z",
              to: "happy-unbirthday",
            },
          ],
          answer: "1989-02-01T00:00:00.000Z",
          expected: "happy-unbirthday",
        },
        {
          name: "date notOn",
          rules: [
            {
              action: "jump",
              questionType: "date",
              operation: "notOn",
              value: "1989-02-01T00:00:00.000Z",
              to: "happy-unbirthday",
            },
          ],
          answer: "1989-02-01T00:00:00.000Z",
          expected: null,
        },
        {
          name: "date earlierThan",
          rules: [
            {
              action: "jump",
              questionType: "date",
              operation: "earlierThan",
              value: "1989-02-01T00:00:00.000Z",
              to: "next-question",
            },
          ],
          answer: "1989-01-01T00:00:00.000Z",
          expected: "next-question",
        },
        {
          name: "date earlierThan",
          rules: [
            {
              action: "jump",
              questionType: "date",
              operation: "earlierThan",
              value: "1989-02-01T00:00:00.000Z",
              to: "next-question",
            },
          ],
          answer: "1989-02-01T00:00:00.000Z",
          expected: null,
        },
        {
          name: "date earlierThan",
          rules: [
            {
              action: "jump",
              questionType: "date",
              operation: "earlierThan",
              value: "1989-02-01T00:00:00.000Z",
              to: "next-question",
            },
          ],
          answer: "1989-02-02T00:00:00.000Z",
          expected: null,
        },
        {
          name: "date earlierThanOrOn",
          rules: [
            {
              action: "jump",
              questionType: "date",
              operation: "earlierThanOrOn",
              value: "1989-02-01T00:00:00.000Z",
              to: "next-question",
            },
          ],
          answer: "1989-02-01T00:00:00.000Z",
          expected: "next-question",
        },
        {
          name: "date earlierThanOrOn",
          rules: [
            {
              action: "jump",
              questionType: "date",
              operation: "earlierThanOrOn",
              value: "1989-02-01T00:00:00.000Z",
              to: "next-question",
            },
          ],
          answer: "1989-02-03T00:00:00.000Z",
          expected: null,
        },
        {
          name: "date earlierThanOrOn",
          rules: [
            {
              action: "jump",
              questionType: "date",
              operation: "earlierThanOrOn",
              value: "1989-02-01T00:00:00.000Z",
              to: "next-question",
            },
          ],
          answer: "1989-02-01T00:00:00.000Z",
          expected: "next-question",
        },
        {
          name: "and",
          rules: [
            {
              operation: "and",
              rules: [
                {
                  action: "jump",
                  questionType: "shortText",
                  operation: "contains",
                  value: "let",
                  to: "next-question",
                },
                {
                  action: "jump",
                  questionType: "shortText",
                  operation: "contains",
                  value: "do",
                  to: "next-question",
                },
                {
                  action: "jump",
                  questionType: "shortText",
                  operation: "contains",
                  value: "it",
                  to: "next-question",
                },
              ],
            },
          ],
          answer: "let's do it, oh yeah!",
          expected: "next-question",
        },
        {
          name: "or",
          rules: [
            {
              operation: "and",
              rules: [
                {
                  action: "jump",
                  questionType: "shortText",
                  operation: "contains",
                  value: "let",
                  to: "next-question",
                },
                {
                  action: "jump",
                  questionType: "shortText",
                  operation: "contains",
                  value: "do",
                  to: "next-question",
                },
                {
                  action: "jump",
                  questionType: "shortText",
                  operation: "contains",
                  value: "it",
                  to: "next-question",
                },
              ],
            },
            {
              action: "jump",
              questionType: "shortText",
              operation: "equal",
              value: "done!",
              to: "end-of-testing",
            },
          ],
          answer: "done!",
          expected: "end-of-testing",
        },
      ] satisfies Array<{
        name: string;
        rules: Rules;
        answer: boolean | number | string;
        expected: string | null;
      }>
    ).forEach((t) => {
      if (t.expected) {
        it(`should jump when "${t.name}" rule match`, () => {
          expect(applyRules(t.rules, t.answer)).toEqual(t.expected);
        });
      } else {
        it(`should return null when "${t.name}" rule doesn't match`, () => {
          expect(applyRules(t.rules, t.answer)).toBeNull();
        });
      }
    });
  });
});
