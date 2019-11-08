import axios from "axios";
import { Cell, Grid, VFlow } from "bold-ui";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

type Open = {
  count: number;
};

type Concluidas = {
  count: number;
};

interface ColunaProps {
  nome: Label;
}

export type Label = {
  id: number;
  nome: string;
};

export const Modulo = (props: ColunaProps) => {
  const [open, setOpen] = useState<Open[]>();
  const [concluidas, setConcluidas] = useState<Concluidas[]>();
  const [labelSelecionada, setLabelSelecionada] = useState<Label>();

  useEffect(() => {
    axios
      .get("/open", {
        params: {
          label: props.nome.nome
        }
      })
      .then(resp => {
        setOpen(resp.data.result.rows);
        console.log("Aberta", resp.data.result.rows);
        console.log(props.nome.nome);
      });
    axios
      .get("/concluidas", {
        params: {
          label: props.nome.nome
        }
      })
      .then(resp => {
        setConcluidas(resp.data.result.rows);
        console.log("Concluidas", resp.data.result.rows);
        console.log(props.nome.nome);
      });
  }, [props.nome]);

  if (!props || !open || !open[0] || !concluidas || !concluidas[0]) {
    return null;
  }

  const pieOptions = {
    pieHole: 0.6,
    slices: [
      {
        color: "#2BB673"
      },
      {
        color: "#d91e48"
      },
      {
        color: "#007fad"
      },
      {
        color: "#e9a227"
      }
    ],
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "233238",
        fontSize: 14
      }
    },
    tooltip: {
      showColorCode: true
    },
    chartArea: {
      left: 0,
      top: 0,
      width: "100%",
      height: "80%"
    },
    fontName: "Roboto"
  };
  const itemToString = (item: Label | null) => {
    if (!item) return "";
    return item.nome;
  };
  const handleOnChange = (item: Label) => {
    setLabelSelecionada(item);
  };
  return (
    <>
      {+concluidas[0].count === 0 && +open[0].count === 0 && (
        <Grid>
          <Cell size={5} />
          <Cell size={7}>
            <h3>Essa label não está atrelada a nenhuma issue</h3>
          </Cell>
        </Grid>
      )}
      <VFlow></VFlow>
      <Chart
        chartType="PieChart"
        data={[
          ["Status", "Quantidade"],
          ["Finalizadas", +concluidas[0].count],
          ["Em desenvolvimento", +open[0].count]
        ]}
        options={pieOptions}
        graph_id="PieChart"
        width={"100%"}
        height={"400px"}
        legend_toggle
      />
    </>
  );
};

export default Modulo;
