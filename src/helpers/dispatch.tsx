import { useMemo } from "react";
import { useAppDispatch } from "../reducers/hooks";

import {
  getNetworkContainers,
  getContainerStacks,
  composeDown,
} from "../reducers/composeReducer";

import {
  stopRunningContainer,
  runStoppedContainer,
  refreshRunningContainers,
  removeContainer,
  refreshStoppedContainer,
} from "../reducers/containerReducer";

import { refreshImages } from "../reducers/imageReducer";

import { getLogs } from "../reducers/logReducer";

import {
  updateSession,
  updateUser,
  logoutUser,
} from "../reducers/sessionReducer";

import { getVolumes, getVolumeContainersList } from "../reducers/volumeReducer";

import {
  ImageObj,
  VolumeObj,
  NetworkObj,
  UserInfo,
  ContainerLogsType,
  VolumeNameObj,
  ContainerType,
  StoppedListType,
} from "../../types";

/**
 * @module | dispatch.tsx
 * @description | Organizes all state dispatch functions into a single custom hook exportable into individual components
 **/

const useSurvey = () => {
  const dispatch = useAppDispatch();

  const actions = useMemo(
    () => ({
      // Dispatch functions used in Home.tsx
      refreshRunningContainers(data: ContainerType[]) {
        dispatch(refreshRunningContainers(data));
      },
      refreshStoppedContainers(data: StoppedListType[]) {
        dispatch(refreshStoppedContainer(data));
      },
      refreshImagesList(data: ImageObj[]) {
        dispatch(refreshImages(data));
      },
      getNetworkContainers(data: NetworkObj[]) {
        dispatch(getNetworkContainers(data));
      },
      updateSession() {
        dispatch(updateSession());
      },
      logoutUser() {
        dispatch(logoutUser());
      },
      getVolumes(data: VolumeNameObj[]) {
        dispatch(getVolumes(data));
      },
      getVolumeContainerList(data: VolumeObj) {
        dispatch(getVolumeContainersList(data));
      },
      // Dispatch functions used in Containers.tsx
      runStoppedContainer(id: string) {
        dispatch(runStoppedContainer(id));
      },
      removeContainer(id: string) {
        dispatch(removeContainer(id));
      },
      stopRunningContainer(id: string) {
        dispatch(stopRunningContainer(id));
      },
      updateUser(userInfo: UserInfo) {
        dispatch(updateUser(userInfo));
      },
      getContainerStacks(data: any) {
        dispatch(getContainerStacks(data));
      },
      composeDown(data: any) {
        dispatch(composeDown(data));
      },

      getContainerLogsDispatcher(data: ContainerLogsType) {
        dispatch(getLogs(data));
      },
    }),
    [dispatch]
  );
  return actions;
};

export default useSurvey;
