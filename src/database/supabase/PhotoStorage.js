import fs from "fs";
import logger from "../../utility/logger.js";
import SupabaseStorage from "./supabaseStorage.js";

export default class Photo extends SupabaseStorage {
  constructor(supabaseClient) {
    super(supabaseClient);
    this.bucketId = "Photos";
    this.mimeTypes = ["image/png", "image/jpg"];

    this.init = async () => {
      const buckets = this.supabaseClient.getBuckets();
      if (buckets.filter((e) => e.id === bucketName).length === 0) {
        await storage.createBucket(bucketName, mimeTypes);
      }
    };
  }

  async deleteBucket(bucketId) {
    const { data, error } = await this.supabase.storage.deleteBucket(bucketId);

    if (error) {
      return error;
    }
    return data;
  }

  async emptyBucket() {
    const { data, error } = await this.supabase.storage.emptyBucket(this.bucketId);

    if (error) {
      return error;
    }
    return { data: data, success: true };
  }

  async uploadLocalImage(file, pathOnBucket = "", bucketFolder = "", cacheControl = "3600", upsert = true) {
    const fileData = fs.readFileSync(file.path);
    let fileName = file.filename;

    if (pathOnBucket !== "") {
      fileName = `${pathOnBucket}\\${fileName}`;
    }

    logger.info(`Uploading to ${this.bucketId}: ${fileName}`);
    const options = {
      cacheControl,
      upsert,
      contentType: file.headers["content-type"],
    };

    const { data, error } = await this.supabase.storage.from(this.bucketId).upload(fileName, fileData, options);

    if (error) {
      return error;
    }
    return { data: data, success: true };
  }

  async uploadUserImage(file, pathOnBucket = "", bucketFolder = "", cacheControl = "3600", upsert = true) {
    const fileData = fs.readFileSync(file.path);
    let fileName = file.filename;

    if (pathOnBucket !== "") {
      fileName = `${pathOnBucket}/${fileName}`;
    }

    logger.info(`Uploading to ${this.bucketId}: ${fileName}`);
    const options = {
      cacheControl,
      upsert,
      contentType: file.headers["content-type"],
    };

    const { data, error } = await this.supabase.storage.from(this.bucketId).upload(fileName, fileData, options);

    if (error) {
      return error;
    }
    return { data: data, success: true };
  }

  async getPhotos(path = "", limit = 100) {
    logger.info("Getting Photos");
    const { data, error } = await this.supabase.storage.from(this.bucketId).list(path, {
      limit: limit,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      return error;
    }
    return data;
  }
}
