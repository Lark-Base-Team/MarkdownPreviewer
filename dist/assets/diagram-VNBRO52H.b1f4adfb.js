import{p as w}from"./chunk-4BMEZGHF.45e355c9.js";import{K as B,s as S,g as F,o as z,p as P,b as W,c as T,_ as s,l as x,L as v,N as D,x as _,aV as A,k as E}from"./index.d3c3699c.js";import{p as N}from"./mermaid-parser.core.b8107190.js";import"./reduce.61b903d1.js";import"./min.583b6ef6.js";var C={packet:[]},m=structuredClone(C),L=B.packet,Y=s(()=>{const t=v({...L,...D().packet});return t.showBits&&(t.paddingY+=10),t},"getConfig"),I=s(()=>m.packet,"getPacket"),K=s(t=>{t.length>0&&m.packet.push(t)},"pushWord"),M=s(()=>{_(),m=structuredClone(C)},"clear"),h={pushWord:K,getPacket:I,getConfig:Y,clear:M,setAccTitle:S,getAccTitle:F,setDiagramTitle:z,getDiagramTitle:P,getAccDescription:W,setAccDescription:T},O=1e4,G=s(t=>{w(t,h);let e=-1,o=[],n=1;const{bitsPerRow:i}=h.getConfig();for(let{start:r,end:a,label:p}of t.blocks){if(a&&a<r)throw new Error(`Packet block ${r} - ${a} is invalid. End must be greater than start.`);if(r!==e+1)throw new Error(`Packet block ${r} - ${a!=null?a:r} is not contiguous. It should start from ${e+1}.`);for(e=a!=null?a:r,x.debug(`Packet block ${r} - ${e} with label ${p}`);o.length<=i+1&&h.getPacket().length<O;){const[b,c]=H({start:r,end:a,label:p},n,i);if(o.push(b),b.end+1===n*i&&(h.pushWord(o),o=[],n++),!c)break;({start:r,end:a,label:p}=c)}}h.pushWord(o)},"populate"),H=s((t,e,o)=>{if(t.end===void 0&&(t.end=t.start),t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);return t.end+1<=e*o?[t,void 0]:[{start:t.start,end:e*o-1,label:t.label},{start:e*o,end:t.end,label:t.label}]},"getNextFittingBlock"),R={parse:s(async t=>{const e=await N("packet",t);x.debug(e),G(e)},"parse")},U=s((t,e,o,n)=>{const i=n.db,r=i.getConfig(),{rowHeight:a,paddingY:p,bitWidth:b,bitsPerRow:c}=r,u=i.getPacket(),l=i.getDiagramTitle(),g=a+p,d=g*(u.length+1)-(l?0:a),k=b*c+2,f=A(e);f.attr("viewbox",`0 0 ${k} ${d}`),E(f,d,k,r.useMaxWidth);for(const[$,y]of u.entries())V(f,y,$,r);f.append("text").text(l).attr("x",k/2).attr("y",d-g/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),V=s((t,e,o,{rowHeight:n,paddingX:i,paddingY:r,bitWidth:a,bitsPerRow:p,showBits:b})=>{const c=t.append("g"),u=o*(n+r)+r;for(const l of e){const g=l.start%p*a+1,d=(l.end-l.start+1)*a-i;if(c.append("rect").attr("x",g).attr("y",u).attr("width",d).attr("height",n).attr("class","packetBlock"),c.append("text").attr("x",g+d/2).attr("y",u+n/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(l.label),!b)continue;const k=l.end===l.start,f=u-2;c.append("text").attr("x",g+(k?d/2:0)).attr("y",f).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",k?"middle":"start").text(l.start),k||c.append("text").attr("x",g+d).attr("y",f).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(l.end)}},"drawWord"),X={draw:U},j={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},q=s(({packet:t}={})=>{const e=v(j,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles"),at={parser:R,db:h,renderer:X,styles:q};export{at as diagram};
