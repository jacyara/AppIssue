import axios from "axios";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { GoogleDataTableColumn } from "react-google-charts/dist/types";
import { Projeto } from "./Equipes";

type Coluna = {
  nome: string;
};

type Icp1 = {
  coluna: string;
  count: number;
};
type Icp2 = {
  coluna: string;
  count: number;
};
type Icp3 = {
  coluna: string;
  count: number;
};
type Icp4 = {
  coluna: string;
  count: number;
};

interface ColunaProps {
  projeto: Projeto;
}

export const CFD = (props: ColunaProps) => {
  const [icp1, setIcp1] = useState<Icp1[]>();
  const [icp2, setIcp2] = useState<Icp2[]>();
  const [icp3, setIcp3] = useState<Icp3[]>();
  const [icp4, setIcp4] = useState<Icp4[]>();

  useEffect(() => {
    axios
      .get("/ipc", {
        params: {
          id: props.projeto.id,
          dataInicio: "26/08/2019",
          dataFim: "02/09/2019"
        }
      })
      .then(resp => {
        console.log("ipc1: ", resp.data);
        setIcp1(resp.data.result.rows);
      });
    axios
      .get("/ipc", {
        params: {
          id: props.projeto.id,
          dataInicio: "02/09/2019",
          dataFim: "09/09/2019"
        }
      })
      .then(resp => {
        console.log("ipc2: ", resp.data);
        setIcp2(resp.data.result.rows);
      });
    axios
      .get("/ipc", {
        params: {
          id: props.projeto.id,
          dataInicio: "09/09/2019",
          dataFim: "16/09/2019"
        }
      })
      .then(resp => {
        console.log("ipc3: ", resp.data);
        setIcp3(resp.data.result.rows);
      });
    axios
      .get("/ipc", {
        params: {
          id: props.projeto.id,
          dataInicio: "16/09/2019",
          dataFim: "23/09/2019"
        }
      })
      .then(resp => {
        console.log("ipc4: ", resp.data);
        setIcp4(resp.data.result.rows);
      });
  }, [props.projeto]);

  if (!props || !icp2 || !icp3 || !icp1 || !icp4) {
    return null;
  }

  function fillColumns(icp: Icp1[]) {
    const data: any[] = [];
    icp.forEach(item => {
      data.push([
        {
          label: item.coluna + "",
          type: "string"
        }
      ]);
    });
    return [
      [
        {
          label: "Semana",
          type: "string"
        }
      ],
      ...data
    ];
  }
  const columns: GoogleDataTableColumn[] = [];

  function fillrows(icp: Icp1[], icp2: Icp2[], icp3: Icp3[], icp4: Icp4[]) {
    const datacol: any[] = [];
    icp.forEach(item => {
      datacol.push(item.coluna + "");
    });

    const data: any[] = [];
    icp.forEach(item => {
      const count: number = +item.count;
      data.push(count);
      console.log(count);
    });

    const data2: any[] = [];
    icp2.forEach(item => {
      const count: number = +item.count;
      data2.push(count);
    });

    const data3: any[] = [];
    icp3.forEach(item => {
      const count: number = +item.count;
      data3.push(count);
    });

    const data4: any[] = [];
    icp4.forEach(item => {
      const count: number = +item.count;
      data4.push(count);
    });
    console.log(["09/09/2019", ...data]);
    return [
      ["02/09/2019", ...data],
      ["09/09/2019", ...data2]
      //["16/09/2019", ...data3]
      // ["23/09/2019", ...data4]
    ];
  }

  return (
    <Chart
      chartType="AreaChart"
      width="100%"
      height="400px"
      legendToggle
      rows={fillrows(icp1, icp2, icp3, icp4)}
      columns={fillColumns(icp1)}
    />
  );
};

export default CFD;
