import axios from "axios";
import { Cell, DataTable, Grid, VFlow } from "bold-ui";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Projeto } from "./Equipes";

type Fechadas = {
  id: number;
  nome: string;
  fechada: Date;
  aberta: Date;
};
interface FechadaProps {
  projeto: Projeto;
}

export const Fechadas = (props: FechadaProps) => {
  const [fechadas, setFechadas] = useState<Fechadas[]>();

  useEffect(() => {
    axios.get("/fechadas", { params: { id: props.projeto.id } }).then(resp => {
      console.log("fechadas: ", resp.data.result.rows);
      setFechadas(resp.data.result.rows);
    });
  }, [props.projeto]);

  if (!props || !fechadas) {
    return null;
  }

  const renderLeadTime = (row: Fechadas) => {
    const date1 = moment(row.aberta);
    const date2 = moment(row.fechada);
    const diferenca = moment.duration(date2.diff(date1));
    const days = diferenca.asDays();
    return <span>{days}</span>;
  };

  // const data = [
  //   fechadas.map(item => {
  //     [item]
  //   })
  //   ["Year", "Visitations", { role: "style" }],
  //   ["2010", 10, "color: gray"],
  //   ["2020", 14, "color: #76A7FA"],
  //   ["2030", 16, "color: blue"],
  //   ["2040", 22, "stroke-color: #703593; stroke-width: 4; fill-color: #C5A5CF"],
  //   [
  //     "2050",
  //     28,
  //     "stroke-color: #871B47; stroke-opacity: 0.6; stroke-width: 8; fill-color: #BC5679; fill-opacity: 0.2"
  //   ]
  // ];

  return (
    <>
      <Grid>
        <Cell size={2} />
        <Cell size={8}>
          <VFlow>
            <h2>Issues fechadas</h2>
            <DataTable<Fechadas>
              rows={fechadas}
              columns={[
                {
                  name: "issue",
                  header: "#Issue",
                  render: item => item.id
                },
                {
                  name: "nome",
                  header: "Título da Issue",
                  render: item => item.nome
                },
                {
                  name: "nome",
                  header: "Lead Time",
                  render: renderLeadTime
                }
              ]}
            />
          </VFlow>
        </Cell>
        <Cell size={2} />
      </Grid>
      {/* <Chart chartType="BarChart" width="100%" height="400px" data={data} /> */}
    </>
  );
};
