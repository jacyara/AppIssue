import axios from "axios";
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

interface ColunaProps {
  projeto: Projeto;
}

export const LeadTime = (props: ColunaProps) => {
  const [fechadas, setFechadas] = useState<Fechadas[]>();

  useEffect(() => {
    axios.get("/fechadas", { params: { id: props.projeto.id } }).then(resp => {
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

  return (
    <>
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
    </>
  );
};

export default LeadTime;
