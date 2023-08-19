import logger from "../../utility/logger.js";
import { connectSupabase } from "./connectSupabase.js";


export default class SupabaseStorage {
  constructor() {
    this.supabase = connectSupabase();
  }

  async createBucket(bucketName, allowedMimeTypes = ["image/png", "image/jpg"], fileSizeLimit =  52428800) {
    const { data, error } = await this.supabase.storage.createBucket(bucketName, {
      public: false,
      allowedMimeTypes: allowedMimeTypes,
      fileSizeLimit: fileSizeLimit,
    });

    if (error) {
      return error;
    }
    return data;
  }

  async getBuckets() {
    const { data, error } = await this.supabase.storage.listBuckets();

    if (error) {
      return error;
    }
    return data;
  }

  async getBucket(bucketId) {
    const { data, error } = await this.supabase.storage.getBucket(bucketId);

    if (error) {
      return error;
    }
    return new SupabaseBucket(this.supabase, data);
  }

  async emptyBucket(bucketId) {
    const { data, error } = await this.supabase.storage.emptyBucket(bucketId);

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
}




