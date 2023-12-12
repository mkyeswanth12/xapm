import React from "react";
import styles from "./Home.module.scss";

/**
 * @module | Home.tsx
 * @description | Handles client-side routing, pre-rendering of data, refreshing of data, etc...
 **/

const Home = (): JSX.Element => {
  return (
    <>
      <div className={styles.wrapper}>
        <h2>Welcome to XAPM!</h2>
      </div>
    </>
  );
};

export default Home;
