import axios from "axios";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Projeto } from "./Equipes";

type Throughput1 = {
  count: string;
};
type Throughput2 = {
  count: string;
};
type Throughput3 = {
  count: string;
};
type Throughput4 = {
  count: string;
};
type Throughput5 = {
  count: string;
};

interface ColunaProps {
  projeto: Projeto;
}

export const Throughput = (props: ColunaProps) => {
  const [throughput1, setThroughput1] = useState<Throughput1[]>();
  const [throughput2, setThroughput2] = useState<Throughput2[]>();
  const [throughput3, setThroughput3] = useState<Throughput3[]>();
  const [throughput4, setThroughput4] = useState<Throughput4[]>();
  const [throughput5, setThroughput5] = useState<Throughput5[]>();

  useEffect(() => {
    axios
      .get("/acumulado", {
        params: {
          id: props.projeto.id,
          dataInicio: "16/09/2019",
          dataFim: "23/09/2019"
        }
      })
      .then(resp => {
        console.log("Trhoughput: ", resp.data.result.rows);
        setThroughput1(resp.data.result.rows);
      });
    axios
      .get("/acumulado", {
        params: {
          id: props.projeto.id,
          dataInicio: "23/09/2019",
          dataFim: "30/09/2019"
        }
      })
      .then(resp => {
        setThroughput2(resp.data.result.rows);
      });
    axios
      .get("/acumulado", {
        params: {
          id: props.projeto.id,
          dataInicio: "30/09/2019",
          dataFim: "07/10/2019"
        }
      })
      .then(resp => {
        setThroughput3(resp.data.result.rows);
      });
    axios
      .get("/acumulado", {
        params: {
          id: props.projeto.id,
          dataInicio: "07/10/2019",
          dataFim: "14/10/2019"
        }
      })
      .then(resp => {
        setThroughput4(resp.data.result.rows);
      });
    axios
      .get("/acumulado", {
        params: {
          id: props.projeto.id,
          dataInicio: "14/10/2019",
          dataFim: "21/10/2019"
        }
      })
      .then(resp => {
        setThroughput5(resp.data.result.rows);
      });
  }, [props.projeto]);

  if (
    !props ||
    !throughput1 ||
    !throughput2 ||
    !throughput3 ||
    !throughput4 ||
    !throughput5
  ) {
    return null;
  }

  const dataT = [
    ["Element", "Issues fechadas"],
    ["23/09/2019", +throughput1[0].count],
    ["30/09/2019", +throughput2[0].count],
    ["07/10/2019", +throughput3[0].count],
    ["14/10/2019", +throughput4[0].count],
    ["21/10/2019", +throughput5[0].count]
  ];

  console.log("sw", throughput1[0].count);
  return (
    <>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={dataT}
        options={{ title: "Gráfico de Throughput" }}
      />
    </>
  );
};

export default Throughput;
