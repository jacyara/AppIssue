import { Cell, Grid } from "bold-ui";
import React from "react";
import { Chart } from "react-google-charts";
import Modulo from "./Modulo";

export const Throughput = () => {
  const dataT = [
    ["Element", "Issues fechadas"],
    ["02/09/2019", 9],
    ["09/09/2019", 3],
    ["16/09/2019", 7],
    ["23/09/2019", 2],
    ["30/09/2019", 5],
    ["07/10/2019", 2]
  ];
  return (
    <>
      <Grid>
        <Cell size={2} />
        <Cell size={8}>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={dataT}
            options={{ title: "Gráfico de Throughput" }}
          />
        </Cell>
        <Cell size={2} />
      </Grid>
      <Grid>
        <Cell size={2} />
        <Cell size={8}>{<Modulo />}</Cell>
        <Cell size={2} />
      </Grid>
    </>
  );
};

export default Throughput;
