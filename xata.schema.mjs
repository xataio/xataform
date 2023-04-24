// @ts-check

/**
 * Xata schema used for `xata:init`
 *
 * @type Schema
 */
export const schema = {
  tables: [
    {
      name: "question",
      columns: [
        { name: "userId", type: "string", notNull: true, defaultValue: "" },
        {
          name: "createdAt",
          type: "datetime",
          notNull: true,
          defaultValue: "now",
        },
        {
          name: "updatedAt",
          type: "datetime",
          notNull: true,
          defaultValue: "now",
        },
        { name: "deletedAt", type: "datetime" },
        { name: "order", type: "int", notNull: true, defaultValue: "0" },
        { name: "title", type: "string", notNull: true, defaultValue: "" },
        { name: "type", type: "string", notNull: true, defaultValue: "" },
        { name: "description", type: "string" },
        { name: "illustration", type: "string" },
        {
          name: "multipleChoice",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "limitMin", type: "int" },
            { name: "limitMax", type: "int" },
            { name: "randomize", type: "bool" },
            { name: "otherOption", type: "bool" },
            { name: "choices", type: "multiple" },
          ],
        },
        {
          name: "contactInfo",
          type: "object",
          columns: [
            {
              name: "firstName",
              type: "object",
              columns: [
                { name: "required", type: "bool" },
                { name: "enabled", type: "bool" },
              ],
            },
            {
              name: "lastName",
              type: "object",
              columns: [
                { name: "required", type: "bool" },
                { name: "enabled", type: "bool" },
              ],
            },
            {
              name: "phoneNumber",
              type: "object",
              columns: [
                { name: "required", type: "bool" },
                { name: "enabled", type: "bool" },
              ],
            },
            {
              name: "email",
              type: "object",
              columns: [
                { name: "required", type: "bool" },
                { name: "enabled", type: "bool" },
              ],
            },
            {
              name: "company",
              type: "object",
              columns: [
                { name: "required", type: "bool" },
                { name: "enabled", type: "bool" },
              ],
            },
          ],
        },
        {
          name: "address",
          type: "object",
          columns: [
            { name: "addressRequired", type: "bool" },
            { name: "address2Required", type: "bool" },
            { name: "cityTownRequired", type: "bool" },
            { name: "stateRegionProvinceRequired", type: "bool" },
            { name: "zipCodeRequired", type: "bool" },
            { name: "countryRequired", type: "bool" },
          ],
        },
        {
          name: "phoneNumber",
          type: "object",
          columns: [{ name: "required", type: "bool" }],
        },
        {
          name: "shortText",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "maxLength", type: "int" },
          ],
        },
        {
          name: "longText",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "maxLength", type: "int" },
          ],
        },
        {
          name: "statement",
          type: "object",
          columns: [
            { name: "hasQuotationMarks", type: "bool" },
            { name: "buttonText", type: "string" },
          ],
        },
        {
          name: "ranking",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "randomize", type: "bool" },
            { name: "choices", type: "multiple" },
          ],
        },
        {
          name: "yesNo",
          type: "object",
          columns: [{ name: "required", type: "bool" }],
        },
        {
          name: "email",
          type: "object",
          columns: [{ name: "required", type: "bool" }],
        },
        {
          name: "opinionScale",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "min", type: "int" },
            { name: "max", type: "int" },
            { name: "labelMin", type: "string" },
            { name: "labelMed", type: "string" },
            { name: "labelMax", type: "string" },
          ],
        },
        {
          name: "rating",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "steps", type: "int" },
          ],
        },
        {
          name: "matrix",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "multipleSelection", type: "bool" },
            { name: "rows", type: "multiple" },
            { name: "columns", type: "multiple" },
          ],
        },
        {
          name: "date",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "format", type: "string" },
            { name: "separator", type: "string" },
          ],
        },
        {
          name: "number",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "min", type: "int" },
            { name: "max", type: "int" },
          ],
        },
        {
          name: "dropdown",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "randomize", type: "bool" },
            { name: "alphabeticalOrder", type: "bool" },
            { name: "choices", type: "multiple" },
          ],
        },
        {
          name: "legal",
          type: "object",
          columns: [{ name: "required", type: "bool" }],
        },
        {
          name: "website",
          type: "object",
          columns: [{ name: "required", type: "bool" }],
        },
        { name: "form", type: "link", link: { table: "form" } },
      ],
    },
    {
      name: "form",
      columns: [
        {
          name: "createdAt",
          type: "datetime",
          notNull: true,
          defaultValue: "now",
        },
        {
          name: "updatedAt",
          type: "datetime",
          notNull: true,
          defaultValue: "now",
        },
        { name: "deletedAt", type: "datetime" },
        { name: "title", type: "string" },
        { name: "status", type: "string" },
        { name: "userId", type: "string" },
        { name: "version", type: "int", notNull: true, defaultValue: "0" },
        { name: "responses", type: "int", notNull: true, defaultValue: "0" },
        {
          name: "unpublishedChanges",
          type: "int",
          notNull: true,
          defaultValue: "0",
        },
      ],
    },
    {
      name: "publishedQuestion",
      columns: [
        { name: "userId", type: "string", notNull: true, defaultValue: "" },
        {
          name: "createdAt",
          type: "datetime",
          notNull: true,
          defaultValue: "now",
        },
        {
          name: "updatedAt",
          type: "datetime",
          notNull: true,
          defaultValue: "now",
        },
        { name: "deletedAt", type: "datetime" },
        { name: "order", type: "int", notNull: true, defaultValue: "0" },
        { name: "title", type: "string", notNull: true, defaultValue: "" },
        { name: "type", type: "string", notNull: true, defaultValue: "" },
        { name: "description", type: "string" },
        { name: "illustration", type: "string" },
        {
          name: "multipleChoice",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "limitMin", type: "int" },
            { name: "limitMax", type: "int" },
            { name: "randomize", type: "bool" },
            { name: "otherOption", type: "bool" },
            { name: "choices", type: "multiple" },
          ],
        },
        {
          name: "contactInfo",
          type: "object",
          columns: [
            {
              name: "firstName",
              type: "object",
              columns: [
                { name: "required", type: "bool" },
                { name: "enabled", type: "bool" },
              ],
            },
            {
              name: "lastName",
              type: "object",
              columns: [
                { name: "required", type: "bool" },
                { name: "enabled", type: "bool" },
              ],
            },
            {
              name: "phoneNumber",
              type: "object",
              columns: [
                { name: "required", type: "bool" },
                { name: "enabled", type: "bool" },
              ],
            },
            {
              name: "email",
              type: "object",
              columns: [
                { name: "required", type: "bool" },
                { name: "enabled", type: "bool" },
              ],
            },
            {
              name: "company",
              type: "object",
              columns: [
                { name: "required", type: "bool" },
                { name: "enabled", type: "bool" },
              ],
            },
          ],
        },
        {
          name: "address",
          type: "object",
          columns: [
            { name: "addressRequired", type: "bool" },
            { name: "address2Required", type: "bool" },
            { name: "cityTownRequired", type: "bool" },
            { name: "stateRegionProvinceRequired", type: "bool" },
            { name: "zipCodeRequired", type: "bool" },
            { name: "countryRequired", type: "bool" },
          ],
        },
        {
          name: "phoneNumber",
          type: "object",
          columns: [{ name: "required", type: "bool" }],
        },
        {
          name: "shortText",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "maxLength", type: "int" },
          ],
        },
        {
          name: "longText",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "maxLength", type: "int" },
          ],
        },
        {
          name: "statement",
          type: "object",
          columns: [
            { name: "hasQuotationMarks", type: "bool" },
            { name: "buttonText", type: "string" },
          ],
        },
        {
          name: "ranking",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "randomize", type: "bool" },
            { name: "choices", type: "multiple" },
          ],
        },
        {
          name: "yesNo",
          type: "object",
          columns: [{ name: "required", type: "bool" }],
        },
        {
          name: "email",
          type: "object",
          columns: [{ name: "required", type: "bool" }],
        },
        {
          name: "opinionScale",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "min", type: "int" },
            { name: "max", type: "int" },
            { name: "labelMin", type: "string" },
            { name: "labelMed", type: "string" },
            { name: "labelMax", type: "string" },
          ],
        },
        {
          name: "rating",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "steps", type: "int" },
          ],
        },
        {
          name: "matrix",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "multipleSelection", type: "bool" },
            { name: "rows", type: "multiple" },
            { name: "columns", type: "multiple" },
          ],
        },
        {
          name: "date",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "format", type: "string" },
            { name: "separator", type: "string" },
          ],
        },
        {
          name: "number",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "min", type: "int" },
            { name: "max", type: "int" },
          ],
        },
        {
          name: "dropdown",
          type: "object",
          columns: [
            { name: "required", type: "bool" },
            { name: "randomize", type: "bool" },
            { name: "alphabeticalOrder", type: "bool" },
            { name: "choices", type: "multiple" },
          ],
        },
        {
          name: "legal",
          type: "object",
          columns: [{ name: "required", type: "bool" }],
        },
        {
          name: "website",
          type: "object",
          columns: [{ name: "required", type: "bool" }],
        },
        { name: "form", type: "link", link: { table: "form" } },
        { name: "version", type: "int", notNull: true, defaultValue: "0" },
      ],
    },
    {
      name: "ending",
      columns: [
        {
          name: "createdAt",
          type: "datetime",
          notNull: true,
          defaultValue: "now",
        },
        { name: "form", type: "link", link: { table: "form" } },
        { name: "subtitle", type: "string" },
        { name: "title", type: "string", notNull: true, defaultValue: "" },
        { name: "userId", type: "string", notNull: true, defaultValue: "" },
      ],
    },
    {
      name: "logic",
      columns: [
        {
          name: "createdAt",
          type: "datetime",
          notNull: true,
          defaultValue: "now",
        },
        {
          name: "updatedAt",
          type: "datetime",
          notNull: true,
          defaultValue: "now",
        },
        { name: "question", type: "link", link: { table: "question" } },
        { name: "operation", type: "string" },
        { name: "value", type: "string" },
        { name: "key", type: "string" },
        { name: "to", type: "link", link: { table: "question" } },
        { name: "action", type: "string" },
        { name: "parentRule", type: "link", link: { table: "logic" } },
      ],
    },
    {
      name: "publishedLogic",
      columns: [
        {
          name: "createdAt",
          type: "datetime",
          notNull: true,
          defaultValue: "now",
        },
        {
          name: "updatedAt",
          type: "datetime",
          notNull: true,
          defaultValue: "now",
        },
        { name: "question", type: "link", link: { table: "question" } },
        { name: "operation", type: "string" },
        { name: "value", type: "string" },
        { name: "key", type: "string" },
        { name: "to", type: "link", link: { table: "question" } },
        { name: "action", type: "string" },
        { name: "parentRule", type: "link", link: { table: "logic" } },
        { name: "version", type: "int", defaultValue: "0" },
      ],
    },
  ],
};

/**
 * @typedef {{
 *  name: string;
 *   type: 'bool' | 'int' | 'float' | 'string' | 'text' | 'email' | 'multiple' | 'link' | 'object' | 'datetime' | 'vector' | 'file[]' | 'file' | 'image[]' | 'image';
 *  notNull?: boolean;
 *  defaultValue?: string;
 *  columns?: Column[];
 * }} Column
 *
 * @typedef {{ tables: Array<{
 *    name: string;
 *    columns: (Column
 *     | {
 *        name: string;
 *        type: 'link';
 *        link: {
 *            table: string;
 *        };
 *    } | {
 *        name: string;
 *        type: 'object';
 *        columns: Column[];
 *    })[];
 * }>}} Schema
 */
