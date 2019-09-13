import axios from "axios";
import { Button, DataTable } from "bold-ui";
import React, { useState } from "react";

export default function App() {
  //var oi = "";
  const [state, setState] = useState({ projetos: [] });
  axios.get("/kkk").then(resp => {
    // console.log(resp.data);
    //setState(resp.data.n);
    setState(resp.data);
    console.log("data", resp.data);
    console.log("state", state);
    state.projetos.map(item => console.log(item.name));
  });

  console.log(state);
  return (
    <>
      <Button>Equipes</Button>
      <DataTable
        rows={state.projetos}
        columns={[{ name: "equipe", render: item => item.name }]}
      />
    </>
  );
}
