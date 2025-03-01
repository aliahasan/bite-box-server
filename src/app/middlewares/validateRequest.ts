import { AnyZodObject } from "zod";
import tryCatchAsync from "../utils/tryCatchAsync";

const validateRequest = (schema: AnyZodObject) => {
  const data = tryCatchAsync(async (req, res, next) => {
    const parsedBody = await schema.parseAsync(req.body, req.cookies);
    req.body = parsedBody;
    next();
  });
  return data;
};
export default validateRequest;
