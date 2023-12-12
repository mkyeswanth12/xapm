import {
  filterOneProperty,
  listOfVolumeProperties,
} from "./volumeHistoryHelper";
import { useMemo } from "react";
import useSurvey from "./dispatch";
import { useAppSelector } from "../reducers/hooks";

const useHelper = () => {
  const dispatch = useSurvey();

  const state = useAppSelector((state) => state);

  const actions = useMemo(
    () => ({
      createNewUser(username: string, password: string) {
        fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        })
          .then(() => {
            actions.getUpdatedUserList();
          })
          .catch((err) => {
            console.log(err);
          });
      },
      checkCookie(): Promise<string> {
        return fetch("/api/login/checkCookie", {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => {
            return data;
          })
          .catch((error) => {
            console.log("error when fetching cookie", error);
          });
      },
      getUid(apiKey: string, dashboard: string): Promise<string> {
        return fetch("/api/gapi/uidkey", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key: apiKey,
            dashboard: dashboard,
          }),
        })
          .then((res) => {
            console.log("Response received:", res);
            return res.json();
          })
          .then((data) => {
            return data;
          })
          .catch((error) => {
            console.log("Error when fetching uid key", error);
          });
      },
      getKey(): Promise<string> {
        return fetch("/api/gapi/key", {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => {
            return data;
          })
          .catch((error) => {
            console.log("Error when fetching api key", error);
          });
      },
      refreshRunning() {
        const { refreshRunningContainers } = dispatch;
        fetch("/api/command/refreshRunning")
          .then((data: Response) => data.json())
          .then((runningContainers) => {
            refreshRunningContainers(runningContainers);
          })
          .catch((err: Error): void => console.log(err));
      },

      refreshStopped() {
        const { refreshStoppedContainers } = dispatch;
        fetch("/api/command/refreshStopped")
          .then((data: Response) => data.json())
          .then((stoppedContainers) => {
            refreshStoppedContainers(stoppedContainers);
          })
          .catch((err: Error): void => console.log(err));
      },

      refreshImages() {
        const { refreshImagesList } = dispatch;
        fetch("/api/command/refreshImages")
          .then((data: Response) => data.json())
          .then((imagesList) => {
            refreshImagesList(imagesList);
          })
          .catch((err: Error): void => console.log(err));
      },
      remove(containerID: string) {
        const { removeContainer } = dispatch;
        fetch(`/api/command/removeContainer?id=${containerID}`, {
          method: "DELETE",
        })
          .then((message) => {
            if (message.status === 401) {
              window.alert("Invalid permissions");
              throw new Error(message);
            } else {
              return message.json();
            }
          })
          .then((message) => {
            console.log({ message });
            removeContainer(containerID);
          })
          .catch((err) => console.log(err));
      },

      stop(id) {
        const { stopRunningContainer } = dispatch;
        fetch(`/api/command/stopContainer?id=${id}`, {
          method: "DELETE",
        })
          .then((message) => {
            if (message.status === 401) {
              window.alert("Invalid permissions");
              throw new Error(message);
            } else {
              return message.json();
            }
          })
          .then((message) => {
            console.log({ message });
            stopRunningContainer(id);
          })
          .catch((err: Error): void => console.log(err));
      },

      runStopped(id: string) {
        const { runStoppedContainer } = dispatch;
        fetch(`/api/command/runStopped?id=${id}`)
          .then((message) => {
            if (message.status === 401) {
              window.alert("Invalid permissions");
              throw new Error(message);
            } else {
              return message.json();
            }
          })
          .then((message) => {
            console.log({ message });
            runStoppedContainer(id);
          })
          .catch((err: Error): void => console.log(err));
      },

      runIm(container) {
        const { refreshRunningContainers } = dispatch;
        fetch("/api/command/runImage", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(container),
        })
          .then((message) => {
            if (message.status === 401) {
              window.alert("Invalid permissions");
              throw new Error(message);
            } else {
              return message.json();
            }
          })
          .then((newRunningList) => {
            refreshRunningContainers(newRunningList);
          })
          .catch((err: Error): void => console.log(err));
      },

      removeIm(id) {
        const { refreshImages } = dispatch;
        fetch(`/api/command/removeImage?id=${id}`, {
          method: "DELETE",
        })
          .then((message) => {
            if (message.status === 401) {
              window.alert("Invalid permissions");
              throw new Error(message);
            }
          })
          .then(() => {
            refreshImages().catch((err: Error): void => console.log(err));
          });
      },

      handlePruneClick(e) {
        e.preventDefault();
        fetch("/api/command/dockerPrune", {
          method: "DELETE",
        })
          .then((message) => {
            if (message.status === 401) {
              window.alert("Invalid permissions");
              throw new Error(message);
            }
          })
          .catch((err: Error): void => console.log(err));
      },

      pullImage(repo) {
        fetch(`/api/command/pullImage?repo=${repo}`)
          .then((message) => {
            if (message.status === 401) {
              window.alert("Invalid permissions");
              throw new Error(message);
            } else {
              return message.json();
            }
          })
          .then((message) => {
            console.log({ message });
          })
          .catch((err: Error): void => console.log(err));
      },

      networkContainers() {
        const { getNetworkContainers } = dispatch;
        fetch("/api/command/networkContainers")
          .then((data: Response) => data.json())
          .then((networkContainers) => {
            getNetworkContainers(networkContainers);
          })
          .catch((err: Error): void => console.log(err));
      },

      dockerComposeUp(filePath, ymlFileName) {
        const { getContainerStacks } = dispatch;
        fetch("/api/command/composeUp", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filePath: filePath,
            ymlFileName: ymlFileName,
          }),
        })
          .then((message) => {
            if (message.status === 401) {
              window.alert("Invalid permissions");
              throw new Error(message);
            } else {
              return message.json();
            }
          })
          .then((dockerOutput) => {
            getContainerStacks(dockerOutput);
          })
          .catch((err: Error): void => console.log(err));
      },

      dockerComposeStacks() {
        const { getContainerStacks } = dispatch;
        fetch("/api/command/composeStacks")
          .then((data: Response) => data.json())
          .then((dockerOutput) => {
            getContainerStacks(dockerOutput);
          })
          .catch((err: Error): void => console.log(err));
      },

      dockerComposeDown(filePath, ymlFileName) {
        const { getContainerStacks } = dispatch;
        fetch("/api/command/composeDown", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filePath: filePath,
            ymlFileName: ymlFileName,
          }),
        })
          .then((message) => {
            if (message.status === 401) {
              window.alert("Invalid permissions");
              throw new Error(message);
            } else {
              return message.json();
            }
          })
          .then((dockerOutput) => {
            getContainerStacks(dockerOutput);
          })
          .catch((err: Error): void => console.log(err));
      },

      writeToDb() {
        const interval = 150000;
        setInterval(() => {
          const runningContainers = state.containers.runningList;

          const stoppedContainers = state.containers.stoppedList;

          if (!runningContainers.length) return;
          const containerParameters: object = {};

          runningContainers.forEach((container: RunningListType) => {
            containerParameters[container.Name] = {
              ID: container.ID,
              names: container.Name,
              Image: container.Image,
              cpu: container.CPUPerc,
              mem: container.MemPerc,
              memuse: container.MemUsage,
              net: container.NetIO,
              block: container.BlockIO,
              pid: container.PIDs,
              timestamp: "current_timestamp",
            };
          });
          if (stoppedContainers.length >= 1) {
            stoppedContainers.forEach((container) => {
              containerParameters[container.Names] = {
                ID: container.ID,
                names: container.Names,
                cpu: "0.00%",
                mem: "0.00%",
                memuse: "0.00MiB/0.00MiB",
                net: "0.00kB/0.00kB",
                block: "0.00kB/0.00kB",
                pid: "0",
                timestamp: "current_timestamp",
              };
            });
          }
          fetch("/api/init/addMetrics", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              containers: (object = containerParameters),
            }),
          }).catch((err: Error): void => {
            console.log(err);
          });
        }, interval);
      },
      setDbSessionTimeZone() {
        const currentTime = new Date();
        const offsetTimeZoneInHours = currentTime.getTimezoneOffset() / 60;

        fetch("/api/init/timezone", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timezone: offsetTimeZoneInHours,
          }),
        })
          .then((data: Response) => data.json())
          .then((response) => {
            console.log(response);
            return;
          })
          .catch((err: Error): void => {
            console.log(err);
          });
      },
      async getContainerGitUrl(container) {
        const response: Response = await fetch("/api/init/github", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            githubUrl: container,
          }),
        });
        return await response.json();
      },

      getAllDockerVolumes() {
        const { getVolumes } = dispatch;
        fetch("/api/command/allDockerVolumes")
          .then((volumes: Response) => volumes.json())
          .then((dockerVolumes) => {
            return getVolumes(filterOneProperty(dockerVolumes, "Name"));
          })
          .catch((err: Error): void => {
            console.log(err);
          });
      },

      getVolumeContainers(volumeName) {
        const { getVolumeContainerList } = dispatch;
        fetch(`/api/command/volumeContainers?volumeName=${volumeName}`)
          .then((data: Response) => data.json())
          .then((volumeContainers) => {
            return getVolumeContainerList(
              listOfVolumeProperties(volumeName, volumeContainers)
            );
          })
          .catch((err: Error): void => {
            console.log(err);
          });
      },

      async getLogs(optionsObj) {
        try {
          const response: Response = await fetch("/api/command/allLogs", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(optionsObj),
          });
          const parsedResponse = await response.json();
          return parsedResponse;
        } catch {
          console.log(err);
        }
      },
    }),
    [dispatch]
  );
  return actions;
};

export default useHelper;
