import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as path from "path";

import apiRouter from "./routes/apiRouter";
import commandRouter from "./routes/commandRouter";
import initRouter from "./routes/initRouter";
import loginRouter from "./routes/loginRouter";
import logoutRouter from "./routes/logoutRouter";
import setupRouter from "./routes/setupRouter";
import signupRouter from "./routes/signupRouter";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("SetupApp"));

// Define routes
app.use("/k8", (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, "../SetupApp/index.html"));
});

app.use("/gapi", apiRouter);
app.use("/command", commandRouter);
app.use("/init", initRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/setup", setupRouter);
app.use("/signup", signupRouter);

// Central error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: "An error occurred",
  };
  const errorObj = Object.assign(defaultErr, { message: err.message });

  // Logging, error response, or additional error handling can be added here

  res.status(errorObj.status).json({ error: errorObj.message });
});

// Unknown endpoint
app.use("/", (req: Request, res: Response) => {
  res.status(404).send({ error: "Unknown endpoint, please try again." });
});

export default app;
