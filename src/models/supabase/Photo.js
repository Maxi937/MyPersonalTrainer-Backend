import { createlogger } from "../../utility/logger.js";
import SupabaseStorage from "./supabaseStorage.js";

const logger = createlogger();

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
    }
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
    return data;
  }

  async uploadImage(fileToUpload, newFileName, bucketFolder="", cacheControl = "3600", upsert = false) {
    const pathOnBucket = `${bucketFolder}\\${newFileName}`;
    // logger.info(`Uploading ${fileToUpload} to ${bucketId}: ${pathOnBucket}`);

    const options = {
      cacheControl,
      upsert,
    };

    const { data, error } = await this.supabase.storage.from(this.bucketId).upload(pathOnBucket, fileToUpload, options);

    if (error) {
      console.log(error);
      return error;
    }
    return data;
  }

  async getPhotos(limit = 100) {
    logger.info("Getting Photos")
    const { data, error } = await this.supabase.storage.from(this.bucketId).list("", {
      limit: limit,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      console.log(error);
      return error;
    }
    return data;
  }
}
