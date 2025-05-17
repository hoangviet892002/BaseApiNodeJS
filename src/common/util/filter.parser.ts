export class FilterParser {
  static parseQuery(query: any): any {
    const filter: any = {};

    for (const [key, value] of Object.entries(query)) {
      if (key === "page" || key === "limit" || key === "sort") continue;

      if (typeof value === "string") {
        if (value.startsWith(">")) {
          filter[key] = { $gt: value.substring(1) };
        } else if (value.startsWith("<")) {
          filter[key] = { $lt: value.substring(1) };
        } else if (value.includes(",")) {
          filter[key] = { $in: value.split(",") };
        } else {
          filter[key] = value;
        }
      } else {
        filter[key] = value;
      }
    }

    return filter;
  }

  static parseSort(sort: string): { [key: string]: 1 | -1 } {
    if (!sort) return { createdAt: -1 };

    const sortOptions: { [key: string]: 1 | -1 } = {};
    const fields = sort.split(",");

    for (const field of fields) {
      if (field.startsWith("-")) {
        sortOptions[field.substring(1)] = -1;
      } else {
        sortOptions[field] = 1;
      }
    }

    return sortOptions;
  }
}
