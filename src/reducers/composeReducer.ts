// import { createSlice } from "@reduxjs/toolkit";

// export const composeSlice = createSlice({
//   name: "composes",
//   initialState: {},
//   reducers: {
//     getNetworkContainers: (state, action: PayloadAction<any>) => {
//       state.networkList.push([...action.payload]);
//     },
//     getContainerStacks: (state, action: PayloadAction<any>) => {
//       const currentState: any = state.composeStack;

//       const composeStackUpdater = (
//         // current state is first array
//         firstArray: [],
//         secondArray: [],
//         outputArray = []
//       ) => {
//         firstArray.forEach((element) => {
//           if (JSON.stringify(secondArray).includes(JSON.stringify(element))) {
//             outputArray.push(element);
//           }
//         });
//         secondArray.forEach((element) => {
//           if (!JSON.stringify(firstArray).includes(JSON.stringify(element))) {
//             outputArray.push(element);
//           }
//         });
//         return outputArray;
//       };

//       state.composeStack = composeStackUpdater(currentState, action.payload);
//     },
//     composeYml: (state, action: PayloadAction<any>) => {
//       state.networkList.push(action.payload[0]);
//     },
//     composeDown: (state, action: PayloadAction<any>) => {
//       const filePath = action.payload;
//       state.composeStack.filter((container) => container.FilePath !== filePath);
//     },
//   },
// });

// export const {
//   getNetworkContainers,
//   getContainerStacks,
//   composeYml,
//   composeDown,
// } = composeSlice.actions;

// export default composeSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ComposeState {
  networkList: any[]; // Define a proper type for networkList
  composeStack: any[]; // Define a proper type for composeStack
}

const initialState: ComposeState = {
  networkList: [],
  composeStack: [],
};

const composeSlice = createSlice({
  name: "composes",
  initialState,
  reducers: {
    getNetworkContainers: (state, action: PayloadAction<any[]>) => {
      state.networkList.push(...action.payload);
    },
    getContainerStacks: (state, action: PayloadAction<any[]>) => {
      const currentState = state.composeStack;

      const composeStackUpdater = (
        firstArray: any[],
        secondArray: any[],
        outputArray: any[] = []
      ) => {
        firstArray.forEach((element) => {
          if (
            !secondArray.find(
              (el) => JSON.stringify(el) === JSON.stringify(element)
            )
          ) {
            outputArray.push(element);
          }
        });
        secondArray.forEach((element) => {
          if (
            !firstArray.find(
              (el) => JSON.stringify(el) === JSON.stringify(element)
            )
          ) {
            outputArray.push(element);
          }
        });
        return outputArray;
      };

      state.composeStack = composeStackUpdater(currentState, action.payload);
    },
    composeYml: (state, action: PayloadAction<any[]>) => {
      state.networkList.push(action.payload[0]);
    },
    composeDown: (state, action: PayloadAction<string>) => {
      const filePath = action.payload;
      state.composeStack = state.composeStack.filter(
        (container) => container.FilePath !== filePath
      );
    },
  },
});

export const {
  getNetworkContainers,
  getContainerStacks,
  composeYml,
  composeDown,
} = composeSlice.actions;

export default composeSlice.reducer;
