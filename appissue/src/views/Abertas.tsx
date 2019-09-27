import axios from "axios";
import { Cell, DataTable, Grid, Theme, useStyles } from "bold-ui";
import moment from "moment";
import React, { CSSProperties, useEffect, useState } from "react";
import { DateTime } from "./DateTime";
import { Projeto } from "./Equipes";

type Abertas = {
  id: number;
  nome: string;
  created: Date;
};
interface AbertasProps {
  projeto: Projeto;
}

export const Abertas = (props: AbertasProps) => {
  const [abertas, setAbertas] = useState<Abertas[]>();
  const { classes } = useStyles(createStyles);

  useEffect(() => {
    axios.get("/abertas", { params: { id: props.projeto.id } }).then(resp => {
      console.log("abertas: ", resp.data.result.rows);
      setAbertas(resp.data.result.rows);
    });
  }, [props.projeto]);

  if (!props || !abertas) {
    return null;
  }

  const renderLeadTime = (row: Abertas) => {
    const date1 = moment(row.created);
    const date2 = moment(new Date());
    const diferenca = moment.duration(date2.diff(date1));
    const days = diferenca.asDays();
    return <span>{Math.round(days)}</span>;
  };

  return (
    <>
      <h2 className={classes.container}>Issues abertas!</h2>
      <Grid alignItems="center">
        <Cell size={12}>
          <DataTable<Abertas>
            rows={abertas}
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
                name: "data",
                header: "Data de criação",
                render: item => (
                  <DateTime value={item.created} format="DD/MM/YYYY" />
                )
              },
              {
                name: "lead time",
                header: "Lead Time Atual",
                render: renderLeadTime
              }
            ]}
          />
        </Cell>
      </Grid>
    </>
  );
};

const createStyles = (theme: Theme) => ({
  container: {
    textAlign: "left",

    "& > p": {
      fontSize: "1rem",
      lineHeight: 2
    }
  } as CSSProperties
});
