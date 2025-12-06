import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.SUPABASE_URL!;
const supabaseKey: string = process.env.SUPABASE_KEY!;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

const storage = multer.memoryStorage();

const combinedFileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (file.fieldname === "photoUrl") {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            const error = new Error(
                "Profile photo must be an image file"
            ) as any;
            error.statusCode = 400;
            cb(error, false);
        }
    } else if (file.fieldname === "documents") {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            const error = new Error("Documents must be PDF files") as any;
            error.statusCode = 400;
            cb(error, false);
        }
    } else {
        const error = new Error("Unexpected field") as any;
        error.statusCode = 400;
        cb(error, false);
    }
};

const uploadCombined = multer({
    storage: storage,
    fileFilter: combinedFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 4,
    },
});

export { uploadCombined, supabaseClient };
