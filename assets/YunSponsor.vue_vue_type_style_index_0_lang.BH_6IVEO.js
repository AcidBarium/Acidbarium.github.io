import{l as m}from"./app.CgSSOJJC.js";import"./chunks/dayjs.CCYrSalk.js";import{f,r as _,c as v,P as n,O as r,S as e,R as x,u as i,V as y,F as h,$ as g,Z as b,X as c}from"./framework.rUGl23J9.js";import{u as k}from"./chunks/vue-i18n.DNe-TL4J.js";const C={class:"yun-sponsor-container flex-center flex-col"},w=["title"],S={key:0,class:"sponsor-description",mb:"4",text:"sm"},B={class:"flex justify-around"},z=["href"],V=["src","title"],D=f({__name:"YunSponsor",setup($){const{t:d}=k(),o=m(),l=_(!1),u=v(()=>{var a;return((a=o.value.sponsor)==null?void 0:a.title)??d("reward.donate")});return(a,t)=>(r(),n("div",C,[e("button",{class:"sponsor-button yun-icon-btn shadow hover:shadow-md",title:u.value,text:"red-400",onClick:t[0]||(t[0]=s=>l.value=!l.value)},t[1]||(t[1]=[e("div",{class:"mt-2px","i-ri-heart-fill":""},null,-1)]),8,w),e("div",{class:c(["qrcode-container qrcode flex-center flex-col",l.value&&"show"]),m:"y-4"},[i(o).sponsor.description?(r(),n("div",S,y(i(o).sponsor.description),1)):x("v-if",!0),e("div",B,[(r(!0),n(h,null,g(i(o).sponsor.methods,(s,p)=>(r(),n("a",{key:p,class:"flex-center flex-col animate-iteration-1 animate-fade-in",href:s.url,target:"_blank",style:b(`color:${s.color}`)},[e("img",{class:"sponsor-method-img",border:"~ rounded",p:"1",loading:"lazy",src:s.url,title:s.name},null,8,V),e("div",{text:"xl",m:"2",class:c(s.icon)},null,2)],12,z))),128))])],2)]))}});export{D as _};
