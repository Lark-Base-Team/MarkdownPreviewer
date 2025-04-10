import{p as U}from"./chunk-4BMEZGHF.12b0002c.js";import{aX as S,aY as z,aZ as Z,K as j,o as K,p as X,s as Y,g as q,c as H,b as J,_ as p,l as F,x as Q,d as tt,L as et,aV as at,a_ as rt,k as nt}from"./index.29c0187f.js";import{p as it}from"./mermaid-parser.core.58a3a997.js";import{d as P}from"./arc.6debf350.js";import{o as st}from"./ordinal.d6400369.js";import"./reduce.4dd25165.js";import"./min.16367d07.js";import"./init.0b4a962a.js";function ot(t,a){return a<t?-1:a>t?1:a>=t?0:NaN}function lt(t){return t}function ct(){var t=lt,a=ot,h=null,o=S(0),g=S(z),A=S(0);function i(e){var r,l=(e=Z(e)).length,c,w,v=0,u=new Array(l),n=new Array(l),d=+o.apply(this,arguments),C=Math.min(z,Math.max(-z,g.apply(this,arguments)-d)),m,$=Math.min(Math.abs(C)/l,A.apply(this,arguments)),E=$*(C<0?-1:1),f;for(r=0;r<l;++r)(f=n[u[r]=r]=+t(e[r],r,e))>0&&(v+=f);for(a!=null?u.sort(function(x,D){return a(n[x],n[D])}):h!=null&&u.sort(function(x,D){return h(e[x],e[D])}),r=0,w=v?(C-l*E)/v:0;r<l;++r,d=m)c=u[r],f=n[c],m=d+(f>0?f*w:0)+E,n[c]={data:e[c],index:r,value:f,startAngle:d,endAngle:m,padAngle:$};return n}return i.value=function(e){return arguments.length?(t=typeof e=="function"?e:S(+e),i):t},i.sortValues=function(e){return arguments.length?(a=e,h=null,i):a},i.sort=function(e){return arguments.length?(h=e,a=null,i):h},i.startAngle=function(e){return arguments.length?(o=typeof e=="function"?e:S(+e),i):o},i.endAngle=function(e){return arguments.length?(g=typeof e=="function"?e:S(+e),i):g},i.padAngle=function(e){return arguments.length?(A=typeof e=="function"?e:S(+e),i):A},i}var R=j.pie,G={sections:new Map,showData:!1,config:R},k=G.sections,L=G.showData,ut=structuredClone(R),pt=p(()=>structuredClone(ut),"getConfig"),gt=p(()=>{k=new Map,L=G.showData,Q()},"clear"),dt=p(({label:t,value:a})=>{k.has(t)||(k.set(t,a),F.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),ft=p(()=>k,"getSections"),mt=p(t=>{L=t},"setShowData"),ht=p(()=>L,"getShowData"),_={getConfig:pt,clear:gt,setDiagramTitle:K,getDiagramTitle:X,setAccTitle:Y,getAccTitle:q,setAccDescription:H,getAccDescription:J,addSection:dt,getSections:ft,setShowData:mt,getShowData:ht},vt=p((t,a)=>{U(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),xt={parse:p(async t=>{const a=await it("pie",t);F.debug(a),vt(a,_)},"parse")},yt=p(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),St=yt,At=p(t=>{const a=[...t.entries()].map(o=>({label:o[0],value:o[1]})).sort((o,g)=>g.value-o.value);return ct().value(o=>o.value)(a)},"createPieArcs"),wt=p((t,a,h,o)=>{F.debug(`rendering pie chart
`+t);const g=o.db,A=tt(),i=et(g.getConfig(),A.pie),e=40,r=18,l=4,c=450,w=c,v=at(a),u=v.append("g");u.attr("transform","translate("+w/2+","+c/2+")");const{themeVariables:n}=A;let[d]=rt(n.pieOuterStrokeWidth);d!=null||(d=2);const C=i.textPosition,m=Math.min(w,c)/2-e,$=P().innerRadius(0).outerRadius(m),E=P().innerRadius(m*C).outerRadius(m*C);u.append("circle").attr("cx",0).attr("cy",0).attr("r",m+d/2).attr("class","pieOuterCircle");const f=g.getSections(),x=At(f),D=[n.pie1,n.pie2,n.pie3,n.pie4,n.pie5,n.pie6,n.pie7,n.pie8,n.pie9,n.pie10,n.pie11,n.pie12],T=st(D);u.selectAll("mySlices").data(x).enter().append("path").attr("d",$).attr("fill",s=>T(s.data.label)).attr("class","pieCircle");let N=0;f.forEach(s=>{N+=s}),u.selectAll("mySlices").data(x).enter().append("text").text(s=>(s.data.value/N*100).toFixed(0)+"%").attr("transform",s=>"translate("+E.centroid(s)+")").style("text-anchor","middle").attr("class","slice"),u.append("text").text(g.getDiagramTitle()).attr("x",0).attr("y",-(c-50)/2).attr("class","pieTitleText");const M=u.selectAll(".legend").data(T.domain()).enter().append("g").attr("class","legend").attr("transform",(s,y)=>{const b=r+l,W=b*T.domain().length/2,V=12*r,B=y*b-W;return"translate("+V+","+B+")"});M.append("rect").attr("width",r).attr("height",r).style("fill",T).style("stroke",T),M.data(x).append("text").attr("x",r+l).attr("y",r-l).text(s=>{const{label:y,value:b}=s.data;return g.getShowData()?`${y} [${b}]`:y});const I=Math.max(...M.selectAll("text").nodes().map(s=>{var y;return(y=s==null?void 0:s.getBoundingClientRect().width)!=null?y:0})),O=w+e+r+l+I;v.attr("viewBox",`0 0 ${O} ${c}`),nt(v,c,O,i.useMaxWidth)},"draw"),Ct={draw:wt},Ft={parser:xt,db:_,renderer:Ct,styles:St};export{Ft as diagram};
