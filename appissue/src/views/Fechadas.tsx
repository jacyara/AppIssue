import axios from "axios";
import { Cell, DataTable, Grid, VFlow } from "bold-ui";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
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

  const calculaLeadTime = (row: Fechadas) => {
    const date1 = moment(row.aberta);
    const date2 = moment(row.fechada);
    const diferenca = moment.duration(date2.diff(date1));
    const days = diferenca.asDays();
    return days;
  };

  const renderLeadTime = (row: Fechadas) => {
    const days = calculaLeadTime(row);
    return <span>{days}</span>;
  };

  function fillData(fechadas: Fechadas[]) {
    const data: any[] = [];
    let acum = 0;
    let i = 0;
    for (; i < fechadas.length; i++) {
      let item = fechadas[i];
      const days = calculaLeadTime(item);
      acum += days !== 0 ? days : 0;
      data.push([
        "Issue nº: " + item.id + " - " + item.nome,
        days,
        acum / (i + 1)
      ]);
    }
    return [["Issues", "Dias", "Media"], ...data];
  }
  // fechadas.forEach(item => {
  //   const days = calculaLeadTime(item);
  //   data.push(["Issue nº: " + item.id + " - " + item.nome, days, acum / i]);
  // });

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
      <Grid>
        <Cell size={2} />
        <Cell size={8}>
          <Chart
            chartType="ScatterChart"
            width="100%"
            height="400px"
            data={fillData(fechadas)}
            options={{
              title: "Gráfico de Lead time das issues",
              series: { 1: { type: "line" } }
            }}
          />
        </Cell>
        <Cell size={2} />
      </Grid>
    </>
  );
};
