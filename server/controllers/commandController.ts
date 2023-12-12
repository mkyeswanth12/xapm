import { Request, Response, NextFunction } from "express";
import {
  CommandController,
  LogObject,
  composeStacksDockerObject,
} from "../../types";
import { exec } from "child_process";

/**
 * Parse all the stdout output into array to manipulate data properly.
 *
 *  @param {*} stdout
 */
const convert = (stdout: string): string[][] => {
  const newArray = stdout.split("\n");

  const result: string[][] = [];
  for (let i = 1; i < newArray.length - 1; i++) {
    let removedSpace: string = newArray[i].replace(/\s+/g, " ");
    removedSpace = removedSpace.replace(/\s[/]\s/g, "/");
    const splittedArray: string[] = removedSpace.split(" ");
    result.push(splittedArray);
  }
  return result;
};

/**
 * @param {string} containerId
 * @returns {object} optionsObj
 */

const makeArrayOfObjects = (
  string: string,
  containerName: string
): LogObject[] => {
  const arrayOfObjects: LogObject[] = string
    .trim()
    .split("\n")
    .map((element: string): LogObject => {
      const obj: LogObject = {
        timeStamp: "",
        logMsg: "",
        containerName: "",
      };

      const logArray = element.split(" ");

      let timeStamp: string | undefined = logArray.find((el) =>
        el.endsWith("Z")
      );

      if (timeStamp) {
        timeStamp = timeStamp.replace(/t(s)?=/, "");
        obj.timeStamp = new Date(timeStamp).toLocaleString("en-US", {
          timeZone: "America/New_York",
        });
      }
      let logMsg: string = logArray.filter((el) => !el.endsWith("Z")).join(" ");
      const closingIndex: number = logMsg.indexOf("]");
      if (closingIndex >= 0) {
        logMsg = logMsg.slice(closingIndex + 1).trim();
      }
      if (logMsg.slice(0, 4) === "LOG:") {
        logMsg = logMsg.slice(4);
      }

      obj.logMsg = logMsg.trim();
      obj.containerName = containerName;

      return obj;
    });
  const arrayOfLogs: LogObject[] = arrayOfObjects.filter(
    (obj: LogObject): boolean => obj.logMsg !== ""
  );
  return arrayOfLogs;
};

/**
 *  @param {*} num
 *  @note unused
 */

/**
 * @description makes our command line functions to return Promise
 *  @param {*} cmd
 */
const promisifiedExec = (cmd: string): Promise<string> => {
  return new Promise(
    (resolve: (result: string) => void, reject: (error: Error) => void) => {
      exec(cmd, (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          reject(error);
        }
        resolve(stdout ? stdout : stderr);
      });
    }
  );
};

/**
 * @description makes our command line functions to return Promise with std err
 *  @param {*} cmd
 */
const promisifiedExecStdErr = (cmd: string): Promise<string> => {
  return new Promise(
    (resolve: (result: string) => void, reject: (error: Error) => void) => {
      exec(cmd, (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          reject(error);
        }
        resolve(stderr);
      });
    }
  );
};

/**
 * @description converts an arr to an arr of objects
 *  @param {*} array, imgPropsArray
 */
const convertArrToObj = (
  array: string[][],
  imgPropsArray: string[]
): object[] => {
  const result: object[] = [];
  for (let i = 0; i < array.length; i++) {
    const containerObj: { [k: string]: string } = {};
    for (let j = 0; j < array[i].length; j++) {
      containerObj[imgPropsArray[j]] = array[i][j];
    }
    result.push(containerObj);
  }
  return result;
};

/**
 * @description runs terminal commands through execs to interact with our containers, images, volumes, and networks
 */
const commandController: CommandController = {
  getContainers: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const result: string = await promisifiedExec(
      'docker ps --format "{{json .}},"'
    );
    const dockerOutput: string[] = JSON.parse(
      `[${result.trim().slice(0, -1).replaceAll(" ", "")}]`
    );
    res.locals.containers = dockerOutput;
    return next();
  },

  runImage: (req: Request, res: Response, next: NextFunction): void => {
    // List of running containers (docker ps)
    const { reps, tag } = req.body;
    const containerId: number = Math.floor(Math.random() * 100);
    const filteredRepo: string = reps
      .replace(/[,/#!$%^&*;:{}=`~()]/g, ".")
      .replace(/\s{2,}/g, " ");
    exec(
      `docker run --name ${filteredRepo}-${tag}_${containerId} ${reps}:${tag}`,
      (error: Error | null, stdout: string, stderr: string): void => {
        if (error) {
          console.log(`${error.message}`);
          return next(error);
        }
        if (stderr) {
          console.log(`runIm stderr: ${stderr}`);
          return;
        }
        return next();
      }
    );
  },

  refreshStopped: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const result: string = await promisifiedExec(
      'docker ps -f "status=exited" --format "{{json .}},"'
    );
    const dockerOutput: string = result.trim().slice(0, -1);
    const parsedDockerOutput: string[] = JSON.parse(`[${dockerOutput}]`);

    res.locals.stoppedContainers = parsedDockerOutput;
    return next();
  },

  refreshImages: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const result: string = await promisifiedExec("docker images");

    const value: string[][] = convert(result);
    const imgPropsArray: string[] = ["reps", "tag", "imgid", "size"];
    const resultImages: string[][] = [];

    for (let i = 0; i < value.length; i++) {
      const innerArray: string[] = [];
      if (value[i][0] !== "<none>") {
        innerArray.push(value[i][0]);
        innerArray.push(value[i][1]);
        innerArray.push(value[i][2]);
        innerArray.push(value[i][6]);
        resultImages.push(innerArray);
      }
    }

    const convertedValue: object[] = convertArrToObj(
      resultImages,
      imgPropsArray
    );

    res.locals.imagesList = convertedValue;
    return next();
  },

  remove: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("removing container");

    console.log("req.query.id", req.query.id);

    exec(
      `docker rm ${req.query.id}`,
      (error: Error | null, stdout: string, stderr: string): void => {
        if (error) {
          console.log(`${error.message}`);
          return next(error);
        }
        if (stderr) {
          console.log(`remove stderr: ${stderr}`);
          return;
        }
        res.locals.idRemoved = {
          message: `Container with id ${req.query.id} deleted`,
        };
        return next();
      }
    );
  },

  stopContainer: (req: Request, res: Response, next: NextFunction): void => {
    exec(
      `docker stop ${req.query.id}`,
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.log(`${error.message}`);
          return next(error);
        }
        if (stderr) {
          console.log(`stop stderr: ${stderr}`);
          return;
        }

        res.locals.containerStopped = {
          message: `Stopped Container with id ${req.query.id} stopped`,
        };
        return next();
      }
    );
  },

  runStopped: (req: Request, res: Response, next: NextFunction): void => {
    exec(
      `docker start ${req.query.id}`,
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.log(`${error.message}`);
          return next(error);
        }
        if (stderr) {
          console.log(`runStopped stderr: ${stderr}`);
          return;
        }

        res.locals.containerRan = {
          message: `Running container with id ${req.query.id}`,
        };
        return next();
      }
    );
  },

  removeImage: (req: Request, res: Response, next: NextFunction): void => {
    exec(
      `docker rmi -f ${req.query.id}`,
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.log(
            `${error.message}` +
              "\nPlease stop running container first then remove."
          );
          return next(error);
        }
        if (stderr) {
          console.log(`removeIm stderr: ${stderr}`);
          return;
        }
        return next();
      }
    );
  },

  dockerPrune: (req: Request, res: Response, next: NextFunction): void => {
    exec(
      "docker system prune --force",
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.log(`${error.message}`);
          return next(error);
        }
        if (stderr) {
          console.log(`handlePruneClick stderr: ${stderr}`);
          return;
        }
        res.locals.pruneMessage = {
          message:
            "Remove all unused containers, networks, images (both dangling and unreferenced)",
        };
        return next();
      }
    );
  },

  pullImage: (req: Request, res: Response, next: NextFunction): void => {
    exec(
      `docker pull ${req.query.repo}`,
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.log(
            `Image repo '${req.query.repo}' seems to not exist, or may be a private repo.`
          );
          return next(error);
        }
        if (stderr) {
          console.log(`pullImage stderr: ${stderr}`);
        }
        res.locals.imgMessage = {
          message: `${req.query.repo} is currently being downloaded`,
        };
        console.log(
          "res.locals.imgMessage in pullImage",
          res.locals.imgMessage
        );
        return next();
      }
    );
  },

  networkContainers: (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    exec(
      'docker network ls --format "{{json .}},"',
      (error: Error | null, stdout: string, stderr: string): void => {
        if (error) {
          console.log(`networkContainers error: ${error.message}`);
          return next(error);
        }
        if (stderr) {
          console.log(`networkContainers stderr: ${stderr}`);
          return;
        }

        const dockerOutput = `[${stdout.trim().slice(0, -1).split(" ").join("")}]`;

        type NetworkContainer = {
          Name: string;
          ID: string;
          Driver: string;
        };

        // remove docker network defaults named: bridge, host, and none
        const networkContainers: NetworkContainer[] = JSON.parse(
          dockerOutput
        ).filter(
          ({ Name }: { Name: string }) =>
            Name !== "bridge" && Name !== "host" && Name !== "none"
        );
        res.locals.networkContainers = networkContainers;
        return next();
      }
    );
  },

  inspectDockerContainer: (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    exec(
      `docker inspect ${req.query.id}`,
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.log(`inspectDockerContainer error: ${error.message}`);
          return next();
        }
        if (stderr) {
          console.log(`inspectDockerContainer stderr: ${stderr}`);
          return;
        }
        res.locals.inspectOut = stdout;
      }
    );
  },

  composeUp: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // const nativeYmlFilenames: Set<string> = new Set([
    //   'docker-compose.yml',
    //   'docker-compose.yaml',
    //   'compose.yml',
    //   'compose.yaml',
    // ]);

    // const cmd: string = nativeYmlFilenames.has(req.body.ymlFileName)
    //   ? `cd ${req.body.filePath} && docker compose up -d`
    //   : `cd ${req.body.filePath} && docker compose -f ${req.body.ymlFileName} up -d`;

    // const result: string | Error = await promisifiedExecStdErr(cmd);
    // res.locals.composeMessage = result;
    return next();
  },

  composeStacks: (req: Request, res: Response, next: NextFunction): void => {
    exec(
      'docker network ls --filter "label=com.docker.compose.network" --format "{{json .}},"',
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.log(`dockerComposeStacks error: ${error.message}`);
          return next(error);
        }
        if (stderr) {
          console.log(`dockerComposeStacks stderr: ${stderr}`);
          return;
        }

        // create array of running container network objects
        // the array is sorted in alphabetical order based on network Name
        const dockerOutput = `[${stdout
          .trim()
          .slice(0, -1)
          .replaceAll(" ", "")}]`;

        const parseDockerOutput = JSON.parse(dockerOutput);
        // if container network was composed through the application, add a filePath and ymlFileName property to its container network object
        if (req.body.filePath && req.body.ymlFileName) {
          const directoryNameArray: string[] = req.body.filePath.split("/");
          parseDockerOutput.forEach((obj: composeStacksDockerObject): void => {
            if (
              obj.Name.includes(
                directoryNameArray[directoryNameArray.length - 1]
              )
            ) {
              obj.FilePath = req.body.filePath;
              obj.YmlFileName = req.body.ymlFileName;
            }
          });
        }
        res.locals.output = parseDockerOutput;
        return next();
      }
    );
  },

  composeDown: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const nativeYmlFilenames: Set<string> = new Set([
      "docker-compose.yml",
      "docker-compose.yaml",
      "compose.yml",
      "compose.yaml",
    ]);

    const cmd: string = nativeYmlFilenames.has(req.body.ymlFileName)
      ? `cd ${req.body.filePath} && docker-compose down`
      : `cd ${req.body.filePath} && docker-compose -f ${req.body.ymlFileName} down`;

    const result: string | Error = await promisifiedExecStdErr(cmd);
    res.locals.composeMessage = result;
    return next();
  },

  getAllDockerVolumes: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    exec(
      'docker volume ls --format "{{json .}},"',
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.log(`getAllDockerVolumes error: ${error.message}`);
          return next(error);
        }
        if (stderr) {
          console.log(`getAllDockerVolumes stderr: ${stderr}`);
          return;
        }

        const dockerOutput: object = JSON.parse(
          `[${stdout.trim().slice(0, -1).replaceAll(" ", "")}]`
        );
        res.locals.dockerVolumes = dockerOutput;
        return next();
      }
    );
  },

  getVolumeContainers: (req: Request, res: Response, next: NextFunction) => {
    exec(
      `docker ps -a --filter volume=${req.query.volumeName} --format "{{json .}},"`,
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.log(`getVolumeContainers error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`getVolumeContainers stderr: ${stderr}`);
          return;
        }
        const dockerOutput: object = JSON.parse(
          `[${stdout.trim().slice(0, -1)}]`
        );
        res.locals.volumeContainers = dockerOutput;
        return next();
      }
    );
    // res.locals.containers = dockerOutput;
    // return next();
  },

  getLogs: (req: Request, res: Response, next: NextFunction) => {
    const containerLogs: { [k: string]: LogObject[] } = {
      stdout: [],
      stderr: [],
    };
    const optionsObj: { [k: string]: string[] } = req.body;

    // iterate through containerIds array in optionsObj
    for (let i = 0; i < optionsObj.containerNames.length; i++) {
      // build inputCommandString to get logs from command line
      let inputCommandString = `docker logs ${optionsObj.containerNames[i]} -t `;
      if (optionsObj.since)
        inputCommandString += `--since ${optionsObj.since} `;

      exec(
        inputCommandString,
        (error: Error | null, stdout: string, stderr: string) => {
          if (error) {
            console.log(
              "Please enter a valid rfc3339 date, Unix timestamp, or Go duration string"
            );
            return next(error);
          }
          containerLogs.stdout = [
            ...containerLogs.stdout,
            ...makeArrayOfObjects(stdout, optionsObj.containerNames[i]),
          ];
          containerLogs.stderr = [
            ...containerLogs.stderr,
            ...makeArrayOfObjects(stderr, optionsObj.containerNames[i]),
          ];
          res.locals.logs = containerLogs;
          if (i === optionsObj.containerNames.length - 1) return next();
        }
      );
    }
  },
};

// export controller here
export default commandController;
