var E=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Q(L){return L&&L.__esModule&&Object.prototype.hasOwnProperty.call(L,"default")?L.default:L}var R={exports:{}};(function(L,B){(function(g,v){L.exports=v()})(E,function(){var g=1e3,v=6e4,U=36e5,k="millisecond",c="second",D="minute",o="hour",d="day",x="week",S="month",m="quarter",p="year",f="date",n="Invalid Date",h=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,Y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,O={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(s){var r=["th","st","nd","rd"],t=s%100;return"["+s+(r[(t-20)%10]||r[t]||r[0])+"]"}},M=function(s,r,t){var i=String(s);return!i||i.length>=r?s:""+Array(r+1-i.length).join(t)+s},b={s:M,z:function(s){var r=-s.utcOffset(),t=Math.abs(r),i=Math.floor(t/60),e=t%60;return(r<=0?"+":"-")+M(i,2,"0")+":"+M(e,2,"0")},m:function s(r,t){if(r.date()<t.date())return-s(t,r);var i=12*(t.year()-r.year())+(t.month()-r.month()),e=r.clone().add(i,S),u=t-e<0,a=r.clone().add(i+(u?-1:1),S);return+(-(i+(t-e)/(u?e-a:a-e))||0)},a:function(s){return s<0?Math.ceil(s)||0:Math.floor(s)},p:function(s){return{M:S,y:p,w:x,d,D:f,h:o,m:D,s:c,ms:k,Q:m}[s]||String(s||"").toLowerCase().replace(/s$/,"")},u:function(s){return s===void 0}},$="en",w={};w[$]=O;var z="$isDayjsObject",N=function(s){return s instanceof q||!(!s||!s[z])},W=function s(r,t,i){var e;if(!r)return $;if(typeof r=="string"){var u=r.toLowerCase();w[u]&&(e=u),t&&(w[u]=t,e=u);var a=r.split("-");if(!e&&a.length>1)return s(a[0])}else{var y=r.name;w[y]=r,e=y}return!i&&e&&($=e),e||!i&&$},_=function(s,r){if(N(s))return s.clone();var t=typeof r=="object"?r:{};return t.date=s,t.args=arguments,new q(t)},l=b;l.l=W,l.i=N,l.w=function(s,r){return _(s,{locale:r.$L,utc:r.$u,x:r.$x,$offset:r.$offset})};var q=function(){function s(t){this.$L=W(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[z]=!0}var r=s.prototype;return r.parse=function(t){this.$d=function(i){var e=i.date,u=i.utc;if(e===null)return new Date(NaN);if(l.u(e))return new Date;if(e instanceof Date)return new Date(e);if(typeof e=="string"&&!/Z$/i.test(e)){var a=e.match(h);if(a){var y=a[2]-1||0,T=(a[7]||"0").substring(0,3);return u?new Date(Date.UTC(a[1],y,a[3]||1,a[4]||0,a[5]||0,a[6]||0,T)):new Date(a[1],y,a[3]||1,a[4]||0,a[5]||0,a[6]||0,T)}}return new Date(e)}(t),this.init()},r.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},r.$utils=function(){return l},r.isValid=function(){return this.$d.toString()!==n},r.isSame=function(t,i){var e=_(t);return this.startOf(i)<=e&&e<=this.endOf(i)},r.isAfter=function(t,i){return _(t)<this.startOf(i)},r.isBefore=function(t,i){return this.endOf(i)<_(t)},r.$g=function(t,i,e){return l.u(t)?this[i]:this.set(e,t)},r.unix=function(){return Math.floor(this.valueOf()/1e3)},r.valueOf=function(){return this.$d.getTime()},r.startOf=function(t,i){var e=this,u=!!l.u(i)||i,a=l.p(t),y=function(F,j){var I=l.w(e.$u?Date.UTC(e.$y,j,F):new Date(e.$y,j,F),e);return u?I:I.endOf(d)},T=function(F,j){return l.w(e.toDate()[F].apply(e.toDate("s"),(u?[0,0,0,0]:[23,59,59,999]).slice(j)),e)},H=this.$W,C=this.$M,A=this.$D,J="set"+(this.$u?"UTC":"");switch(a){case p:return u?y(1,0):y(31,11);case S:return u?y(1,C):y(0,C+1);case x:var Z=this.$locale().weekStart||0,P=(H<Z?H+7:H)-Z;return y(u?A-P:A+(6-P),C);case d:case f:return T(J+"Hours",0);case o:return T(J+"Minutes",1);case D:return T(J+"Seconds",2);case c:return T(J+"Milliseconds",3);default:return this.clone()}},r.endOf=function(t){return this.startOf(t,!1)},r.$set=function(t,i){var e,u=l.p(t),a="set"+(this.$u?"UTC":""),y=(e={},e[d]=a+"Date",e[f]=a+"Date",e[S]=a+"Month",e[p]=a+"FullYear",e[o]=a+"Hours",e[D]=a+"Minutes",e[c]=a+"Seconds",e[k]=a+"Milliseconds",e)[u],T=u===d?this.$D+(i-this.$W):i;if(u===S||u===p){var H=this.clone().set(f,1);H.$d[y](T),H.init(),this.$d=H.set(f,Math.min(this.$D,H.daysInMonth())).$d}else y&&this.$d[y](T);return this.init(),this},r.set=function(t,i){return this.clone().$set(t,i)},r.get=function(t){return this[l.p(t)]()},r.add=function(t,i){var e,u=this;t=Number(t);var a=l.p(i),y=function(C){var A=_(u);return l.w(A.date(A.date()+Math.round(C*t)),u)};if(a===S)return this.set(S,this.$M+t);if(a===p)return this.set(p,this.$y+t);if(a===d)return y(1);if(a===x)return y(7);var T=(e={},e[D]=v,e[o]=U,e[c]=g,e)[a]||1,H=this.$d.getTime()+t*T;return l.w(H,this)},r.subtract=function(t,i){return this.add(-1*t,i)},r.format=function(t){var i=this,e=this.$locale();if(!this.isValid())return e.invalidDate||n;var u=t||"YYYY-MM-DDTHH:mm:ssZ",a=l.z(this),y=this.$H,T=this.$m,H=this.$M,C=e.weekdays,A=e.months,J=e.meridiem,Z=function(j,I,V,G){return j&&(j[I]||j(i,u))||V[I].slice(0,G)},P=function(j){return l.s(y%12||12,j,"0")},F=J||function(j,I,V){var G=j<12?"AM":"PM";return V?G.toLowerCase():G};return u.replace(Y,function(j,I){return I||function(V){switch(V){case"YY":return String(i.$y).slice(-2);case"YYYY":return l.s(i.$y,4,"0");case"M":return H+1;case"MM":return l.s(H+1,2,"0");case"MMM":return Z(e.monthsShort,H,A,3);case"MMMM":return Z(A,H);case"D":return i.$D;case"DD":return l.s(i.$D,2,"0");case"d":return String(i.$W);case"dd":return Z(e.weekdaysMin,i.$W,C,2);case"ddd":return Z(e.weekdaysShort,i.$W,C,3);case"dddd":return C[i.$W];case"H":return String(y);case"HH":return l.s(y,2,"0");case"h":return P(1);case"hh":return P(2);case"a":return F(y,T,!0);case"A":return F(y,T,!1);case"m":return String(T);case"mm":return l.s(T,2,"0");case"s":return String(i.$s);case"ss":return l.s(i.$s,2,"0");case"SSS":return l.s(i.$ms,3,"0");case"Z":return a}return null}(j)||a.replace(":","")})},r.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},r.diff=function(t,i,e){var u,a=this,y=l.p(i),T=_(t),H=(T.utcOffset()-this.utcOffset())*v,C=this-T,A=function(){return l.m(a,T)};switch(y){case p:u=A()/12;break;case S:u=A();break;case m:u=A()/3;break;case x:u=(C-H)/6048e5;break;case d:u=(C-H)/864e5;break;case o:u=C/U;break;case D:u=C/v;break;case c:u=C/g;break;default:u=C}return e?u:l.a(u)},r.daysInMonth=function(){return this.endOf(S).$D},r.$locale=function(){return w[this.$L]},r.locale=function(t,i){if(!t)return this.$L;var e=this.clone(),u=W(t,i,!0);return u&&(e.$L=u),e},r.clone=function(){return l.w(this.$d,this)},r.toDate=function(){return new Date(this.valueOf())},r.toJSON=function(){return this.isValid()?this.toISOString():null},r.toISOString=function(){return this.$d.toISOString()},r.toString=function(){return this.$d.toUTCString()},s}(),K=q.prototype;return _.prototype=K,[["$ms",k],["$s",c],["$m",D],["$H",o],["$W",d],["$M",S],["$y",p],["$D",f]].forEach(function(s){K[s[1]]=function(r){return this.$g(r,s[0],s[1])}}),_.extend=function(s,r){return s.$i||(s(r,q,_),s.$i=!0),_},_.locale=W,_.isDayjs=N,_.unix=function(s){return _(1e3*s)},_.en=w[$],_.Ls=w,_.p={},_})})(R);var X=R.exports;const ot=Q(X);var tt={exports:{}};(function(L,B){(function(g,v){L.exports=v()})(E,function(){return function(g,v,U){g=g||{};var k=v.prototype,c={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function D(d,x,S,m){return k.fromToBase(d,x,S,m)}U.en.relativeTime=c,k.fromToBase=function(d,x,S,m,p){for(var f,n,h,Y=S.$locale().relativeTime||c,O=g.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],M=O.length,b=0;b<M;b+=1){var $=O[b];$.d&&(f=m?U(d).diff(S,$.d,!0):S.diff(d,$.d,!0));var w=(g.rounding||Math.round)(Math.abs(f));if(h=f>0,w<=$.r||!$.r){w<=1&&b>0&&($=O[b-1]);var z=Y[$.l];p&&(w=p(""+w)),n=typeof z=="string"?z.replace("%d",w):z(w,x,$.l,h);break}}if(x)return n;var N=h?Y.future:Y.past;return typeof N=="function"?N(n):N.replace("%s",n)},k.to=function(d,x){return D(d,x,this,!0)},k.from=function(d,x){return D(d,x,this)};var o=function(d){return d.$u?U.utc():U()};k.toNow=function(d){return this.to(o(this),d)},k.fromNow=function(d){return this.from(o(this),d)}}})})(tt);var nt=tt.exports;const ft=Q(nt);var et={exports:{}};(function(L,B){(function(g,v){L.exports=v()})(E,function(){var g={year:0,month:1,day:2,hour:3,minute:4,second:5},v={};return function(U,k,c){var D,o=function(m,p,f){f===void 0&&(f={});var n=new Date(m),h=function(Y,O){O===void 0&&(O={});var M=O.timeZoneName||"short",b=Y+"|"+M,$=v[b];return $||($=new Intl.DateTimeFormat("en-US",{hour12:!1,timeZone:Y,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",timeZoneName:M}),v[b]=$),$}(p,f);return h.formatToParts(n)},d=function(m,p){for(var f=o(m,p),n=[],h=0;h<f.length;h+=1){var Y=f[h],O=Y.type,M=Y.value,b=g[O];b>=0&&(n[b]=parseInt(M,10))}var $=n[3],w=$===24?0:$,z=n[0]+"-"+n[1]+"-"+n[2]+" "+w+":"+n[4]+":"+n[5]+":000",N=+m;return(c.utc(z).valueOf()-(N-=N%1e3))/6e4},x=k.prototype;x.tz=function(m,p){m===void 0&&(m=D);var f,n=this.utcOffset(),h=this.toDate(),Y=h.toLocaleString("en-US",{timeZone:m}),O=Math.round((h-new Date(Y))/1e3/60),M=15*-Math.round(h.getTimezoneOffset()/15)-O;if(!Number(M))f=this.utcOffset(0,p);else if(f=c(Y,{locale:this.$L}).$set("millisecond",this.$ms).utcOffset(M,!0),p){var b=f.utcOffset();f=f.add(n-b,"minute")}return f.$x.$timezone=m,f},x.offsetName=function(m){var p=this.$x.$timezone||c.tz.guess(),f=o(this.valueOf(),p,{timeZoneName:m}).find(function(n){return n.type.toLowerCase()==="timezonename"});return f&&f.value};var S=x.startOf;x.startOf=function(m,p){if(!this.$x||!this.$x.$timezone)return S.call(this,m,p);var f=c(this.format("YYYY-MM-DD HH:mm:ss:SSS"),{locale:this.$L});return S.call(f,m,p).tz(this.$x.$timezone,!0)},c.tz=function(m,p,f){var n=f&&p,h=f||p||D,Y=d(+c(),h);if(typeof m!="string")return c(m).tz(h);var O=function(w,z,N){var W=w-60*z*1e3,_=d(W,N);if(z===_)return[W,z];var l=d(W-=60*(_-z)*1e3,N);return _===l?[W,_]:[w-60*Math.min(_,l)*1e3,Math.max(_,l)]}(c.utc(m,n).valueOf(),Y,h),M=O[0],b=O[1],$=c(M).utcOffset(b);return $.$x.$timezone=h,$},c.tz.guess=function(){return Intl.DateTimeFormat().resolvedOptions().timeZone},c.tz.setDefault=function(m){D=m}}})})(et);var it=et.exports;const ct=Q(it);var rt={exports:{}};(function(L,B){(function(g,v){L.exports=v()})(E,function(){var g="minute",v=/[+-]\d\d(?::?\d\d)?/g,U=/([+-]|\d\d)/g;return function(k,c,D){var o=c.prototype;D.utc=function(n){var h={date:n,utc:!0,args:arguments};return new c(h)},o.utc=function(n){var h=D(this.toDate(),{locale:this.$L,utc:!0});return n?h.add(this.utcOffset(),g):h},o.local=function(){return D(this.toDate(),{locale:this.$L,utc:!1})};var d=o.parse;o.parse=function(n){n.utc&&(this.$u=!0),this.$utils().u(n.$offset)||(this.$offset=n.$offset),d.call(this,n)};var x=o.init;o.init=function(){if(this.$u){var n=this.$d;this.$y=n.getUTCFullYear(),this.$M=n.getUTCMonth(),this.$D=n.getUTCDate(),this.$W=n.getUTCDay(),this.$H=n.getUTCHours(),this.$m=n.getUTCMinutes(),this.$s=n.getUTCSeconds(),this.$ms=n.getUTCMilliseconds()}else x.call(this)};var S=o.utcOffset;o.utcOffset=function(n,h){var Y=this.$utils().u;if(Y(n))return this.$u?0:Y(this.$offset)?S.call(this):this.$offset;if(typeof n=="string"&&(n=function($){$===void 0&&($="");var w=$.match(v);if(!w)return null;var z=(""+w[0]).match(U)||["-",0,0],N=z[0],W=60*+z[1]+ +z[2];return W===0?0:N==="+"?W:-W}(n),n===null))return this;var O=Math.abs(n)<=16?60*n:n,M=this;if(h)return M.$offset=O,M.$u=n===0,M;if(n!==0){var b=this.$u?this.toDate().getTimezoneOffset():-1*this.utcOffset();(M=this.local().add(O+b,g)).$offset=O,M.$x.$localOffset=b}else M=this.utc();return M};var m=o.format;o.format=function(n){var h=n||(this.$u?"YYYY-MM-DDTHH:mm:ss[Z]":"");return m.call(this,h)},o.valueOf=function(){var n=this.$utils().u(this.$offset)?0:this.$offset+(this.$x.$localOffset||this.$d.getTimezoneOffset());return this.$d.valueOf()-6e4*n},o.isUTC=function(){return!!this.$u},o.toISOString=function(){return this.toDate().toISOString()},o.toString=function(){return this.toDate().toUTCString()};var p=o.toDate;o.toDate=function(n){return n==="s"&&this.$offset?D(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate():p.call(this)};var f=o.diff;o.diff=function(n,h,Y){if(n&&this.$u===n.$u)return f.call(this,n,h,Y);var O=this.local(),M=D(n).local();return f.call(O,M,h,Y)}}})})(rt);var st=rt.exports;const ht=Q(st);var ut={exports:{}};(function(L,B){(function(g,v){L.exports=v()})(E,function(){return{name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(g){var v=["th","st","nd","rd"],U=g%100;return"["+g+(v[(U-20)%10]||v[U]||v[0])+"]"}}})})(ut);var at={exports:{}};(function(L,B){(function(g,v){L.exports=v(X)})(E,function(g){function v(c){return c&&typeof c=="object"&&"default"in c?c:{default:c}}var U=v(g),k={name:"zh-cn",weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),ordinal:function(c,D){return D==="W"?c+"周":c+"日"},weekStart:1,yearStart:4,formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日Ah点mm分",LLLL:"YYYY年M月D日ddddAh点mm分",l:"YYYY/M/D",ll:"YYYY年M月D日",lll:"YYYY年M月D日 HH:mm",llll:"YYYY年M月D日dddd HH:mm"},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"},meridiem:function(c,D){var o=100*c+D;return o<600?"凌晨":o<900?"早上":o<1100?"上午":o<1300?"中午":o<1800?"下午":"晚上"}};return U.default.locale(k,null,!0),k})})(at);export{E as c,ot as d,Q as g,ft as r,ct as t,ht as u};
