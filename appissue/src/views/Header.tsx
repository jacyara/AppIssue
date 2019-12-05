import { Cell, Grid, VFlow } from "bold-ui";
import React from "react";

export default function Header() {
  return (
    <>
      <VFlow>
        <br></br>
        <Grid>
          <Cell size={1} />
          <h1>AppIssue_</h1>
        </Grid>
        <hr></hr>
      </VFlow>
    </>
  );
}
