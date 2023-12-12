export const filterOneProperty = (input: object[], filterInput: string) => {
  const filteredOutput: object[] = [];

  // looping thru arr of objs
  for (let i = 0; i < input.length; i++) {

    const filteredArr = Object.entries(input[i]).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([key, value]) => key === filterInput
    );
    // push the filtered arr to outputArr
    filteredOutput.push(Object.fromEntries(filteredArr));
  }

  return filteredOutput;
};

export const volumeByName = (
  getVolumeContainers,
  arrayOfVolumeNames,
  getVolumeContainersList
) => {
  let volumeName;
  arrayOfVolumeNames.forEach((element) => {
    volumeName = getVolumeContainers(element["Name"], getVolumeContainersList);
  });
  return volumeName;
};

export const listOfVolumeProperties = (volumeName, dockerOutput) => {
  const volumeList = {
    vol_name: volumeName,
    containers: [],
  };
  let containerProperties = {};

  for (let i = 0; i < dockerOutput.length; i++) {
    const container = dockerOutput[i];

    for (const key in container) {
      if (key === "Names") containerProperties["Names"] = container["Names"];
      if (key === "State") containerProperties["State"] = container["State"];
      if (key === "Status") containerProperties["Status"] = container["Status"];
    }
    volumeList.containers.push(containerProperties);
    containerProperties = {};
  }

  return volumeList;
};
