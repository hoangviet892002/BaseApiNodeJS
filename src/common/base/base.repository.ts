// @src/repositories/base.repository.ts

import {
  FilterOptions,
  PaginationOptions,
  PaginationResult,
  SortOptions,
} from "@src/common/interfaces/mongo.interface";
import { Document, FilterQuery, Model, QueryOptions } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(dto: Partial<T>): Promise<T> {
    const entity = new this.model(dto);
    return entity.save();
  }

  async findOne(
    filter: FilterQuery<T>,
    options?: QueryOptions
  ): Promise<T | null> {
    return this.model.findOne(filter, null, options).exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findAll(
    filter: FilterOptions<T> = {},
    sort?: SortOptions,
    select?: string
  ): Promise<T[]> {
    let query = this.model.find(filter);
    if (sort) query = query.sort(sort);
    if (select) query = query.select(select);
    return query.exec();
  }

  async paginate(
    filter: FilterOptions<T> = {},
    paginationOptions: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginationResult<T>> {
    const { page = 1, limit = 10 } = paginationOptions;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.model
        .find(filter)
        .sort(sort || { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return {
      records,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, dto: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const count = await this.model.countDocuments(filter).exec();
    return count > 0;
  }
}
