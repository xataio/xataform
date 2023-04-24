import { describe, it, expect } from "vitest";
import { fromXataRecords, toXataRecords } from "./logic.utils";
import { Logic } from "./logic.schemas";

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
});
