(window["webpackJsonphello-express"]=window["webpackJsonphello-express"]||[]).push([[0],{178:function(e,n,t){e.exports=t(631)},631:function(e,n,t){"use strict";t.r(n);var o=t(0),a=t.n(o),r=t(21),l=t.n(r),c=t(177),s=t(172),u=t.n(s),p=t(82);l.a.render(a.a.createElement((function(){var e=Object(o.useState)({projetos:[]}),n=Object(c.a)(e,2),t=n[0],r=n[1];return u.a.get("/kkk").then((function(e){r(e.data),console.log("data",e.data),console.log("state",t),t.projetos.map((function(e){return console.log(e.name)}))})),console.log(t),a.a.createElement(a.a.Fragment,null,a.a.createElement(p.Button,null,"Equipes"),a.a.createElement(p.DataTable,{rows:t.projetos,columns:[{name:"equipe",render:function(e){return e.name}}]}))}),null),document.querySelector("#root"))}},[[178,1,2]]]);
//# sourceMappingURL=main.ce6fe7ed.chunk.js.map