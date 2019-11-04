import { Tag, VFlow } from "bold-ui";
import React from "react";
import { Chart } from "react-google-charts";

export const Modulo = () => {
  const pieOptions = {
    title: "Porcentagem do módulo pronto",
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
  return (
    <>
      <VFlow>
        <h3>Porcentagem do módulo pronto</h3>

        <Tag>Lista de Atendimentos</Tag>
      </VFlow>
      <Chart
        chartType="PieChart"
        data={[
          ["Age", "Weight"],
          ["Finalizadas", 3],
          ["Em desenvolvimento", 2],
          ["Code Review", 1],
          ["Sprint Backlog", 4]
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
