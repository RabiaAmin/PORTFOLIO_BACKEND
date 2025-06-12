
// This is a wrapper function to catch errors in async Express route handlers, so you don’t need try-catch blocks everywhere.
export const catchAsyncErrors = (func) => {
  return (req,res,next) => {
    Promise.resolve(func(req,res,next)).catch(next);
  }
}