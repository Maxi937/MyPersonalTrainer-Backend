import { createlogger } from "../../utility/logger.js";
import { createClient } from "@supabase/supabase-js";

const logger = createlogger();

export default class SupabaseBucket {
  constructor(supabaseClient, bucket) {
    this.supabase = supabaseClient
    this.bucketId = bucket.id
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

  async uploadFileToBucket(fileToUpload, bucketId, bucketFolder, newFileName, cacheControl = "3600", upsert = false) {
    const pathOnBucket = `${bucketFolder}\\${newFileName}`;
    // logger.info(`Uploading ${fileToUpload} to ${bucketId}: ${pathOnBucket}`);

    const options = {
      cacheControl,
      upsert,
    };

    const { data, error } = await this.supabase.storage.from(bucketId).upload(pathOnBucket, fileToUpload, options);

    if (error) {
      console.log(error);
      return error;
    }
    return data;
  }

  async getFiles(bucketFolder, limit = 100) {
    const { data, error } = await this.supabase.storage.from(this.bucketId).list(bucketFolder, {
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
