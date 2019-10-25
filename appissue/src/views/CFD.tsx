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

  const [coluna, setColuna] = useState<Coluna[]>();

  useEffect(() => {
    axios
      .get("/col", {
        params: {
          id: props.projeto.id
        }
      })
      .then(resp => {
        console.log("resp", resp.data.result.rows);
        setColuna(resp.data.result.rows);
      });
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

  if (!props || !icp2 || !icp3 || !icp1 || !icp4 || !coluna) {
    return null;
  }

  function fillColumns(coluna: Coluna[]): GoogleDataTableColumn[] {
    const data: any[] = [];
    coluna.map(item => {
      data.push({
        label: item.nome,
        type: "number"
      });
    });
    console.log(data);
    return [
      {
        label: "Semana",
        type: "string"
      },
      ...data
    ];
  }

  const columns: GoogleDataTableColumn[] = [];

  const countIssue = (name: string, icp: Icp1[]) => {
    var col = icp.filter(x => x.coluna === name);
    if (col.length === 0) {
      return 0;
    }
    return col[0].count;
  };

  function fillrows(
    coluna: Coluna[],
    icp: Icp1[],
    icp2: Icp2[],
    icp3: Icp3[],
    icp4: Icp4[]
  ) {
    const data1: any[] = [];
    const data2: any[] = [];
    const data3: any[] = [];
    const data4: any[] = [];
    coluna.map(item1 => {
      const count1: number = +countIssue(item1.nome, icp);
      data1.push(count1);
      const count2: number = +countIssue(item1.nome, icp2) + count1;
      data2.push(count2);
      const count3: number = +countIssue(item1.nome, icp3) + count2;
      data3.push(count3);
      const count4: number = +countIssue(item1.nome, icp4) + count3;
      data4.push(count4);
    });
    return [
      ["02/09/2019", ...data1],
      ["09/09/2019", ...data2],
      ["16/09/2019", ...data3],
      ["23/09/2019", ...data4]
    ];
  }

  const options = {
    title: "Cumulative flow diagram"
  };

  return (
    <Chart
      chartType="AreaChart"
      width="100%"
      height="400px"
      legendToggle
      options={options}
      rows={fillrows(coluna, icp1, icp2, icp3, icp4)}
      columns={fillColumns(coluna)}
    />
  );
};

export default CFD;
