const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let W = 0, H = 0;

function resize(){
  const el = document.getElementById('sim');
  W = canvas.width = el.clientWidth;
  H = canvas.height = el.clientHeight;
}
window.addEventListener('resize', resize);
resize();

function geo(){
  const cx = W*0.47, cy = H*0.50;
  const lw = Math.min(W,H)*0.032*0.88;
  const nsW = lw*5, ewW = lw*5;
  const ixL=cx-nsW/2, ixR=cx+nsW/2, ixT=cy-ewW/2, ixB=cy+ewW/2;
  const lx=[cx-2*lw, cx-lw, cx, cx+lw, cx+2*lw];
  const ly=[cy-2*lw, cy-lw, cy, cy+lw, cy+2*lw];
  return {cx,cy,lw,nsW,ewW,ixL,ixR,ixT,ixB,lx,ly};
}

function mkRng(seed){
  let s=seed>>>0;
  return ()=>{s=(s*1664525+1013904223)>>>0;return s/4294967295;};
}

function drawTerrain(){
  ctx.fillStyle='#8c7a5c';
  ctx.fillRect(0,0,W,H);
  const rng=mkRng(13);
  for(let i=0;i<80;i++){
    const x=rng()*W,y=rng()*H,r=30+rng()*80;
    ctx.fillStyle=rng()>0.5?'rgba(0,0,0,0.06)':'rgba(255,255,255,0.025)';
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  }
  const rng2=mkRng(77),g=geo();
  for(let i=0;i<18;i++){
    const gx=rng2()*W,gy=rng2()*H;
    if((gx>g.ixL-g.nsW&&gx<g.ixR+g.nsW)||(gy>g.ixT-g.ewW&&gy<g.ixB+g.ewW))continue;
    ctx.fillStyle=`rgba(60,90,40,${0.25+rng2()*0.2})`;
    ctx.fillRect(gx,gy,20+rng2()*50,15+rng2()*40);
  }
}

const STONE=['#d4c49a','#c9b485','#cbb878','#dbc090','#c8ae72'];
const TERRA=['#c06848','#b85e40','#d07858'];

function drawBuildings(){
  const {ixL,ixR,ixT,ixB,lw}=geo();
  const sw=lw*0.8, rng=mkRng(42);
  const quads=[
    {x:0,y:0,w:ixL-sw,h:ixT-sw},
    {x:ixR+sw,y:0,w:W-ixR-sw,h:ixT-sw},
    {x:0,y:ixB+sw,w:ixL-sw,h:H-ixB-sw},
    {x:ixR+sw,y:ixB+sw,w:W-ixR-sw,h:H-ixB-sw},
  ];
  for(const q of quads){
    if(q.w<20||q.h<20)continue;
    ctx.fillStyle='#b8a882';ctx.fillRect(q.x,q.y,q.w,q.h);
    const cols=Math.max(1,Math.floor(q.w/90)), rows=Math.max(1,Math.floor(q.h/80));
    const cw=q.w/cols, ch=q.h/rows;
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const pad=10+rng()*16;
        const bx=q.x+c*cw+pad, by=q.y+r*ch+pad;
        const bw=cw-pad*2-rng()*14, bh=ch-pad*2-rng()*14;
        if(bw<12||bh<12)continue;
        const roll=rng();
        if(roll>0.72){
          const col=roll>0.88?'#ede4ce':roll>0.75?TERRA[Math.floor(rng()*TERRA.length)]:STONE[Math.floor(rng()*STONE.length)];
          ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fillRect(bx+3,by+3,bw,bh);
          ctx.fillStyle=col;ctx.fillRect(bx,by,bw,bh);
        } else if(roll>0.44){
          ctx.fillStyle='#5a8a3c';ctx.fillRect(bx,by,bw,bh);
          ctx.fillStyle='#4a7a2c';ctx.fillRect(bx,by,bw,bh*0.4);
          for(let t=0,tc=Math.floor(2+rng()*3);t<tc;t++){
            const tx=bx+rng()*bw,ty=by+rng()*bh;
            ctx.fillStyle='#3a6a20';ctx.beginPath();ctx.arc(tx,ty,3+rng()*5,0,Math.PI*2);ctx.fill();
            ctx.fillStyle='#4a8a28';ctx.beginPath();ctx.arc(tx-1,ty-1,2+rng()*4,0,Math.PI*2);ctx.fill();
          }
        } else {
          ctx.fillStyle='#8a8a80';ctx.fillRect(bx,by,bw,bh);
          ctx.strokeStyle='rgba(255,255,255,0.25)';ctx.lineWidth=0.8;
          const spaces=Math.max(2,Math.floor(bw/10));
          for(let s=1;s<spaces;s++){
            const lx2=bx+s*(bw/spaces);
            ctx.beginPath();ctx.moveTo(lx2,by);ctx.lineTo(lx2,by+bh);ctx.stroke();
          }
          ctx.beginPath();ctx.moveTo(bx,by+bh/2);ctx.lineTo(bx+bw,by+bh/2);ctx.stroke();
        }
      }
    }
  }
}

function drawRoads(){
  const {nsW,ewW,ixL,ixR,ixT,ixB,lw}=geo();
  const sw=lw*0.52;
  ctx.fillStyle='#c4b494';
  ctx.fillRect(ixL-sw,0,sw,H);ctx.fillRect(ixR,0,sw,H);
  ctx.fillRect(0,ixT-sw,ixL,sw);ctx.fillRect(ixR,ixT-sw,W-ixR,sw);
  ctx.fillRect(0,ixB,ixL,sw);ctx.fillRect(ixR,ixB,W-ixR,sw);
  ctx.fillStyle='#5a5a52';
  ctx.fillRect(ixL,0,nsW,H);ctx.fillRect(0,ixT,W,ewW);
  ctx.fillStyle='#606058';ctx.fillRect(ixL,ixT,nsW,ewW);
  ctx.strokeStyle='#3e3e36';ctx.lineWidth=1;ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(ixL,0);ctx.lineTo(ixL,ixT);ctx.moveTo(ixL,ixB);ctx.lineTo(ixL,H);
  ctx.moveTo(ixR,0);ctx.lineTo(ixR,ixT);ctx.moveTo(ixR,ixB);ctx.lineTo(ixR,H);
  ctx.moveTo(0,ixT);ctx.lineTo(ixL,ixT);ctx.moveTo(ixR,ixT);ctx.lineTo(W,ixT);
  ctx.moveTo(0,ixB);ctx.lineTo(ixL,ixB);ctx.moveTo(ixR,ixB);ctx.lineTo(W,ixB);
  ctx.stroke();
  if(junctionMode==='roundabout'){
    const cx=(ixL+ixR)/2,cy=(ixT+ixB)/2;
    ctx.fillStyle='#6a655b';ctx.beginPath();ctx.arc(cx,cy,lw*1.9,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#5f8442';ctx.beginPath();ctx.arc(cx,cy,lw*1.45,0,Math.PI*2);ctx.fill();
  }
}

function drawMarkings(){
  const {cx,cy,nsW,ewW,ixL,ixR,ixT,ixB,lw,lx,ly}=geo();
  if(junctionMode==='roundabout'){
    const rbR=lw*2.75;
    ctx.strokeStyle='rgba(255,255,255,0.62)';ctx.lineWidth=1.3;ctx.setLineDash([6,6]);
    ctx.beginPath();ctx.arc(cx,cy,rbR,0,Math.PI*2);ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(255,255,255,0.26)';ctx.font=`${lw*0.72}px sans-serif`;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('↺',cx,cy-rbR-lw*0.55);
    return;
  }
  const nsCL=cx+lw*0.5, ewCL=cy+lw*0.5;
  ctx.strokeStyle='#d4b030';ctx.lineWidth=1.4;ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(nsCL-1.8,0);ctx.lineTo(nsCL-1.8,ixT);ctx.moveTo(nsCL-1.8,ixB);ctx.lineTo(nsCL-1.8,H);
  ctx.moveTo(nsCL+1.8,0);ctx.lineTo(nsCL+1.8,ixT);ctx.moveTo(nsCL+1.8,ixB);ctx.lineTo(nsCL+1.8,H);
  ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.48)';ctx.lineWidth=1;ctx.setLineDash([lw*0.5,lw*0.5]);
  for(const x of[cx-1.5*lw, cx-0.5*lw, cx+1.5*lw]){
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,ixT);ctx.moveTo(x,ixB);ctx.lineTo(x,H);ctx.stroke();
  }
  ctx.strokeStyle='#d4b030';ctx.lineWidth=1.4;ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(0,ewCL-1.8);ctx.lineTo(ixL,ewCL-1.8);ctx.moveTo(ixR,ewCL-1.8);ctx.lineTo(W,ewCL-1.8);
  ctx.moveTo(0,ewCL+1.8);ctx.lineTo(ixL,ewCL+1.8);ctx.moveTo(ixR,ewCL+1.8);ctx.lineTo(W,ewCL+1.8);
  ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.48)';ctx.lineWidth=1;ctx.setLineDash([lw*0.5,lw*0.5]);
  for(const y of[cy-1.5*lw, cy-0.5*lw, cy+1.5*lw]){
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(ixL,y);ctx.moveTo(ixR,y);ctx.lineTo(W,y);ctx.stroke();
  }
  ctx.strokeStyle='rgba(255,255,255,0.85)';ctx.lineWidth=2;
  const sl=lw*0.45;
  ctx.beginPath();
  ctx.moveTo(ixL,ixT-sl);ctx.lineTo(ixR,ixT-sl);ctx.moveTo(ixL,ixB+sl);ctx.lineTo(ixR,ixB+sl);
  ctx.moveTo(ixL-sl,ixT);ctx.lineTo(ixL-sl,ixB);ctx.moveTo(ixR+sl,ixT);ctx.lineTo(ixR+sl,ixB);
  ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.52)';
  const zs=5,zg=4.5,zpN=Math.floor(nsW/(zs+zg)),zpE=Math.floor(ewW/(zs+zg));
  for(let i=0;i<zpN;i++){
    ctx.fillRect(ixL+i*(zs+zg),ixT-sl-lw*0.6,zs,lw*0.45);
    ctx.fillRect(ixL+i*(zs+zg),ixB+sl+lw*0.15,zs,lw*0.45);
  }
  for(let i=0;i<zpE;i++){
    ctx.fillRect(ixL-sl-lw*0.6,ixT+i*(zs+zg),lw*0.45,zs);
    ctx.fillRect(ixR+sl+lw*0.15,ixT+i*(zs+zg),lw*0.45,zs);
  }
  ctx.fillStyle='rgba(255,255,255,0.22)';
  ctx.font=`${lw*0.8}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  [lx[3],lx[4]].forEach(x=>ctx.fillText('↓',x,H*0.22));
  [lx[0],lx[1],lx[2]].forEach(x=>ctx.fillText('↑',x,H*0.78));
  [ly[0],ly[1],ly[2]].forEach(y=>ctx.fillText('→',W*0.17,y));
  [ly[3],ly[4]].forEach(y=>ctx.fillText('←',W*0.83,y));
  ctx.fillStyle='rgba(255,255,255,0.38)';
  ctx.font=`${lw*0.62}px sans-serif`;
  const arY=ixB+lw*1.85, arX=ixT-lw*1.85, arYe=ixL-lw*2, arYw=ixR+lw*2;
  ctx.fillText('↰',lx[0],arY);ctx.fillText('↑',lx[1],arY);ctx.fillText('↑↱',lx[2],arY);
  ctx.fillText('↑↱',lx[3],arX);ctx.fillText('↰↑',lx[4],arX);
  ctx.fillText('↰',arYe,ly[0]);ctx.fillText('→',arYe,ly[1]);ctx.fillText('→↱',arYe,ly[2]);
  ctx.fillText('→↰',arYw,ly[3]);ctx.fillText('↱→',arYw,ly[4]);
}

function palm(x,y,r){
  ctx.fillStyle='#5a4030';ctx.beginPath();ctx.arc(x,y,r*0.22,0,Math.PI*2);ctx.fill();
  for(let i=0;i<6;i++){
    const a=(i/6)*Math.PI*2,ex=x+Math.cos(a)*r*1.2,ey=y+Math.sin(a)*r*1.2;
    ctx.strokeStyle='rgba(38,80,28,0.85)';ctx.lineWidth=r*0.55;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(ex,ey);ctx.stroke();
  }
  ctx.fillStyle='#2e5820';ctx.beginPath();ctx.arc(x,y,r*0.55,0,Math.PI*2);ctx.fill();
}

function orangeTree(x,y,r){
  ctx.fillStyle='#2d5018';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(50,80,30,0.55)';ctx.beginPath();ctx.arc(x-r*0.12,y-r*0.15,r*0.7,0,Math.PI*2);ctx.fill();
}

function drawFurniture(){
  const {ixL,ixR,ixT,ixB,lw}=geo();
  const sw=lw*0.52,spacing=lw*3.5,treeR=sw*0.44;
  for(let y=ixT-spacing;y>0;y-=spacing){palm(ixL-sw*0.5,y,treeR);palm(ixR+sw*0.5,y,treeR);}
  for(let y=ixB+spacing;y<H;y+=spacing){palm(ixL-sw*0.5,y,treeR);palm(ixR+sw*0.5,y,treeR);}
  for(let x=ixL-spacing;x>0;x-=spacing){orangeTree(x,ixT-sw*0.5,treeR*0.82);orangeTree(x,ixB+sw*0.5,treeR*0.82);}
  for(let x=ixR+spacing;x<W;x+=spacing){orangeTree(x,ixT-sw*0.5,treeR*0.82);orangeTree(x,ixB+sw*0.5,treeR*0.82);}
  ctx.fillStyle='#9e8e70';
  for(const [x,y] of[[ixL,ixT],[ixR,ixT],[ixL,ixB],[ixR,ixB]]){
    ctx.beginPath();ctx.arc(x,y,lw*0.17,0,Math.PI*2);ctx.fill();
  }
}

function drawPlaceLabels(){
  const {cx,cy,lw}=geo();
  const sans=getComputedStyle(document.documentElement).getPropertyValue('--sans');
  const labels=[
    {icon:'🍴',name:'Avanti',x:cx-lw*7.5,y:cy+lw*6.0},
    {icon:'🍴',name:'Pia Bella',x:cx-lw*14.5,y:cy+lw*6.0},
    {icon:'🍴',name:'Maripenne',x:cx+lw*5.5,y:cy-lw*12.0},
    {icon:'🍴',name:'I beti italian',x:cx+lw*8.5,y:cy-lw*5.5},
    {icon:'🍴',name:'Gocmen',x:cx+lw*5.5,y:cy+lw*6.5},
    {icon:'☕',name:'Tango To Buddha',x:cx+lw*11.5,y:cy+lw*1.0},
    {icon:'🏫',name:'ARUCAD',x:cx-lw*2.5,y:cy+lw*6.5},
  ];
  const fontSize=Math.max(8,Math.floor(lw*0.44));
  ctx.textBaseline='middle';ctx.textAlign='left';
  ctx.font=`${fontSize}px ${sans}`;
  for(const l of labels){
    const text=`${l.icon} ${l.name}`;
    const m=ctx.measureText(text);
    const padX=4,padY=2.6;
    ctx.fillStyle='rgba(238,230,211,0.72)';
    ctx.fillRect(l.x-padX,l.y-fontSize*0.64-padY,m.width+padX*2,fontSize+padY*2);
    ctx.strokeStyle='rgba(255,252,244,0.84)';ctx.lineWidth=2.2;
    ctx.fillStyle='rgba(82,73,58,0.94)';
    ctx.strokeText(text,l.x,l.y);ctx.fillText(text,l.x,l.y);
  }
}

function drawSignalHeads(g){
  if(!(junctionMode==='intersection'&&scenario==='signals'))return;
  const {ixL,ixR,ixT,ixB,lw}=g;
  const mast=lw*0.42;
  function head(x,y,isGreen){
    ctx.fillStyle='rgba(24,24,22,0.92)';
    ctx.fillRect(x-mast*0.72,y-mast*0.52,mast*1.45,mast*1.04);
    ctx.fillStyle=isGreen?'#4ea94e':'#732c22';
    ctx.beginPath();ctx.arc(x-mast*0.34,y,mast*0.19,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=isGreen?'#2e5428':'#cf5542';
    ctx.beginPath();ctx.arc(x+mast*0.34,y,mast*0.19,0,Math.PI*2);ctx.fill();
  }
  head(ixL-lw*0.9,ixT-lw*0.7,tlPhase===0);
  head(ixR+lw*0.9,ixB+lw*0.7,tlPhase===1);
  head(ixR+lw*0.9,ixT-lw*0.7,tlPhase===2);
  head(ixL-lw*0.9,ixB+lw*0.7,tlPhase===3);
}

let vehicles=[], vid=0, simT=0, passed=0;
let spawnAcc={}, playing=true;
let mainInflow=700, secInflow=350, freeSpd=50, tlapse=3, truckPct=15, politeness=55;
let junctionMode='intersection', scenario='signals', closureMode={n:null,s:null,e:null,w:null};
let TL_TIMES=[14,14,12,12], tlPhase=0, tlClock=0;

const CAR_COLORS=[
  '#c83838','#3870cc','#d09028','#38aa38','#8848cc',
  '#28a8a8','#e07028','#a0a820','#c84080','#787870',
  '#f0f0e8','#203878','#702020','#286830','#704880',
];

const LANE_META={
  SB0:{axis:'NS',dir: 1,adj:'SB1'}, SB1:{axis:'NS',dir: 1,adj:'SB0'},
  NB0:{axis:'NS',dir:-1,adj:'NB1'}, NB1:{axis:'NS',dir:-1,adj:'NB2'}, NB2:{axis:'NS',dir:-1,adj:'NB1'},
  EB0:{axis:'EW',dir: 1,adj:'EB1'}, EB1:{axis:'EW',dir: 1,adj:'EB2'}, EB2:{axis:'EW',dir: 1,adj:'EB1'},
  WB0:{axis:'EW',dir:-1,adj:'WB1'}, WB1:{axis:'EW',dir:-1,adj:'WB0'},
};

function makeLanes(g){
  const {lx,ly}=g;
  const lanes=[];
  if(junctionMode==='roundabout'){
    lanes.push({id:'SB1',x:lx[3],y0:-30,y1:H+30,axis:'NS',dir:1,inflow:mainInflow,key:'n1'});
    lanes.push({id:'NB0',x:lx[2],y0:H+30,y1:-30,axis:'NS',dir:-1,inflow:mainInflow,key:'s1'});
    lanes.push({id:'EB',y:ly[2],x0:-30,x1:W+30,axis:'EW',dir:1,inflow:secInflow,key:'w1'});
    lanes.push({id:'WB',y:ly[3],x0:W+30,x1:-30,axis:'EW',dir:-1,inflow:secInflow,key:'e1'});
    return lanes;
  }
  lanes.push({id:'NB0',x:lx[0],y0:H+30,y1:-30,axis:'NS',dir:-1,inflow:mainInflow/6,key:'s1',turns:['left']});
  lanes.push({id:'NB1',x:lx[1],y0:H+30,y1:-30,axis:'NS',dir:-1,inflow:mainInflow/6,key:'s2',turns:['straight']});
  lanes.push({id:'NB2',x:lx[2],y0:H+30,y1:-30,axis:'NS',dir:-1,inflow:mainInflow/6,key:'s3',turns:['straight','right']});
  lanes.push({id:'SB0',x:lx[3],y0:-30,y1:H+30,axis:'NS',dir:1,inflow:mainInflow/4,key:'n1',turns:['right','straight']});
  lanes.push({id:'SB1',x:lx[4],y0:-30,y1:H+30,axis:'NS',dir:1,inflow:mainInflow/4,key:'n2',turns:['straight','left']});
  lanes.push({id:'EB0',y:ly[0],x0:-30,x1:W+30,axis:'EW',dir:1,inflow:secInflow/6,key:'w1',turns:['left']});
  lanes.push({id:'EB1',y:ly[1],x0:-30,x1:W+30,axis:'EW',dir:1,inflow:secInflow/6,key:'w2',turns:['straight']});
  lanes.push({id:'EB2',y:ly[2],x0:-30,x1:W+30,axis:'EW',dir:1,inflow:secInflow/6,key:'w3',turns:['straight','right']});
  lanes.push({id:'WB0',y:ly[3],x0:W+30,x1:-30,axis:'EW',dir:-1,inflow:secInflow/4,key:'e1',turns:['right','straight']});
  lanes.push({id:'WB1',y:ly[4],x0:W+30,x1:-30,axis:'EW',dir:-1,inflow:secInflow/4,key:'e2',turns:['straight','left']});
  return lanes;
}

function spawnVehicle(lane,g){
  const {lw}=g;
  const isTruck=Math.random()*100<truckPct;
  const len=isTruck?lw*2.4:lw*1.25, wid=isTruck?lw*0.82:lw*0.6;
  const isNS=lane.axis==='NS';
  const px=isNS?lane.x:lane.x0, py=isNS?lane.y0:lane.y;
  const angle=isNS?(lane.dir>0?Math.PI/2:-Math.PI/2):(lane.dir>0?0:Math.PI);
  const clear=vehicles.every(v=>!v.active||v.laneId!==lane.id||Math.hypot(v.px-px,v.py-py)>len*3);
  if(!clear)return;
  const baseSpd=(freeSpd/3.6)*(isTruck?0.78:1)*(0.9+Math.random()*0.1);
  const col=isTruck?['#3c3428','#484030','#4c4838','#404848'][Math.floor(Math.random()*4)]:CAR_COLORS[Math.floor(Math.random()*CAR_COLORS.length)];
  const turns=lane.turns||['straight'];
  const intent=turns[Math.floor(Math.random()*turns.length)];
  vehicles.push({id:vid++,px,py,laneId:lane.id,axis:lane.axis,dir:lane.dir,fixX:isNS?lane.x:null,fixY:isNS?null:lane.y,color:col,len,wid,angle,spd:baseSpd,freeSpd:baseSpd,active:true,isTruck,stopTime:0,intent,tr:null,turned:false});
}

function normAng(a){
  while(a<=-Math.PI)a+=Math.PI*2;
  while(a>Math.PI)a-=Math.PI*2;
  return a;
}
function cwDelta(from,to){let d=to-from;while(d<0)d+=Math.PI*2;return d;}
function angDist(a,b){return Math.abs(normAng(a-b));}

function updateVehicles(dt,g){
  const {cx,cy,ixL,ixR,ixT,ixB,lw}=g;
  const lanes=makeLanes(g);
  const laneById=Object.fromEntries(lanes.map(l=>[l.id,l]));
  const closedLaneInfo={};
  for(const laneId of Object.values(closureMode)){
    if(!laneId)continue;
    const m=LANE_META[laneId];if(!m)continue;
    const closurePos=m.axis==='NS'?(m.dir>0?ixT-lw*0.85:ixB+lw*0.85):(m.dir>0?ixL-lw*0.85:ixR+lw*0.85);
    closedLaneInfo[laneId]={...m,closurePos};
  }
  for(const lane of lanes){
    spawnAcc[lane.id]=(spawnAcc[lane.id]??0)+dt;
    const iv=3600/lane.inflow;
    while(spawnAcc[lane.id]>=iv){spawnAcc[lane.id]-=iv;spawnVehicle(lane,g);}
  }
  const s0_car=lw*0.8,s0_trk=lw*1.1,T=0.9,a0=2.2,b0=3.5;
  const impoliteness=1-(politeness/100);
  for(const v of vehicles){
    if(!v.active)continue;
    if(junctionMode==='roundabout'&&v.rb){
      const rbR=lw*2.75;
      let ringSpd=Math.min(v.spd,(freeSpd/3.6)*0.5);
      let minAhead=999;
      for(const u of vehicles){
        if(u===v||!u.active||!u.rb)continue;
        const ahead=cwDelta(v.rb.angle,u.rb.angle);
        if(ahead>0.02&&ahead<minAhead)minAhead=ahead;
      }
      const safeHeadway=(v.len*1.7)/rbR;
      if(minAhead<safeHeadway)ringSpd=Math.min(ringSpd,(freeSpd/3.6)*0.14);
      else if(minAhead<safeHeadway*1.7)ringSpd=Math.min(ringSpd,(freeSpd/3.6)*0.28);
      v.rb.angle+=Math.max(0.08,ringSpd/rbR)*dt;
      const traveled=cwDelta(v.rb.startAngle,v.rb.angle);
      if(traveled>=v.rb.exitDelta){
        const a=normAng(v.rb.angle);
        delete v.rb;
        if(a>-Math.PI/4&&a<=Math.PI/4){v.axis='EW';v.dir=1;v.fixY=g.ly[2];v.fixX=null;v.py=v.fixY;v.angle=0;}
        else if(a>Math.PI/4&&a<=3*Math.PI/4){v.axis='NS';v.dir=1;v.fixX=g.lx[3];v.fixY=null;v.px=v.fixX;v.angle=Math.PI/2;}
        else if(a<=-Math.PI/4&&a>-3*Math.PI/4){v.axis='NS';v.dir=-1;v.fixX=g.lx[2];v.fixY=null;v.px=v.fixX;v.angle=-Math.PI/2;}
        else{v.axis='EW';v.dir=-1;v.fixY=g.ly[3];v.fixX=null;v.py=v.fixY;v.angle=Math.PI;}
      } else {
        v.spd=ringSpd;
        v.px=cx+Math.cos(v.rb.angle)*rbR;
        v.py=cy+Math.sin(v.rb.angle)*rbR;
        v.angle=v.rb.angle+Math.PI/2;
        if(v.spd<0.3)v.stopTime+=dt;else v.stopTime=0;
        if(v.px<-80||v.px>W+80||v.py<-80||v.py>H+80){v.active=false;passed++;}
        continue;
      }
    }

    let mustStop=false, closureStop=null;
    const ci=junctionMode==='intersection'?closedLaneInfo[v.laneId]:null;
    if(ci){
      const vPos=ci.axis==='NS'?v.py:v.px;
      const distToClosure=ci.dir>0?ci.closurePos-vPos:vPos-ci.closurePos;
      if(distToClosure<lw*6.2){
        const stopBuffer=Math.max(v.len*0.95,lw*0.75);
        const nearBarrier=distToClosure<lw*2.2;
        const aheadNeed=nearBarrier?v.len*1.35:v.len*2.4;
        const behindNeed=nearBarrier?v.len*0.95:v.len*1.8;
        let ahead=9999,behind=9999;
        for(const u of vehicles){
          if(u===v||!u.active||u.laneId!==ci.adj)continue;
          const rel=ci.dir*((ci.axis==='NS'?u.py:u.px)-vPos);
          if(rel>=0&&rel<ahead)ahead=rel;
          if(rel<0&&-rel<behind)behind=-rel;
        }
        if(ahead>aheadNeed&&behind>behindNeed&&laneById[ci.adj]){
          v.laneId=ci.adj;
          if(ci.axis==='NS'){v.fixX=laneById[ci.adj].x;v.px=v.fixX;}
          else{v.fixY=laneById[ci.adj].y;v.py=v.fixY;}
        } else if(distToClosure<stopBuffer){
          mustStop=true;
          closureStop={axis:ci.axis,dir:ci.dir,coord:ci.closurePos-ci.dir*stopBuffer};
        } else {
          v.spd=Math.min(v.spd,(freeSpd/3.6)*(nearBarrier?0.42:0.35));
        }
      }
    }
    if(junctionMode==='roundabout'){
      const ap=lw*3.2,sl=lw*1.45;
      const nearEntry=
        (v.axis==='NS'&&v.dir>0&&v.py<ixT-sl&&v.py>ixT-sl-ap)||
        (v.axis==='NS'&&v.dir<0&&v.py>ixB+sl&&v.py<ixB+sl+ap)||
        (v.axis==='EW'&&v.dir>0&&v.px<ixL-sl&&v.px>ixL-sl-ap)||
        (v.axis==='EW'&&v.dir<0&&v.px>ixR+sl&&v.px<ixR+sl+ap);
      if(nearEntry){
        const entryAngle=Math.atan2(v.py-cy,v.px-cx);
        for(const u of vehicles){
          if(u===v||!u.active||!u.rb)continue;
          if(angDist(u.rb.angle,entryAngle)<0.42){mustStop=true;break;}
        }
      }
    }
    if(scenario==='signals'){
      const ap=lw*2.8,sl=lw*0.45;
      if(v.axis==='NS'){
        if(v.dir===-1&&tlPhase!==0&&v.py>ixB+sl&&v.py<ixB+sl+ap)mustStop=true;
        if(v.dir===1&&tlPhase!==1&&v.py<ixT-sl&&v.py>ixT-sl-ap)mustStop=true;
      } else if(v.axis==='EW'){
        if(v.dir===1&&tlPhase!==2&&v.px<ixL-sl&&v.px>ixL-sl-ap)mustStop=true;
        if(v.dir===-1&&tlPhase!==3&&v.px>ixR+sl&&v.px<ixR+sl+ap)mustStop=true;
      }
    }
    if(scenario==='allstop'){
      const ap=lw*2,sl=lw*0.45;
      if(v.axis==='NS'){
        if(v.dir>0&&v.py<ixT-sl&&v.py>ixT-sl-ap)mustStop=true;
        if(v.dir<0&&v.py>ixB+sl&&v.py<ixB+sl+ap)mustStop=true;
      } else {
        if(v.dir>0&&v.px<ixL-sl&&v.px>ixL-sl-ap)mustStop=true;
        if(v.dir<0&&v.px>ixR+sl&&v.px<ixR+sl+ap)mustStop=true;
      }
    }
    let gap=9999;
    for(const u of vehicles){
      if(u===v||!u.active||u.laneId!==v.laneId)continue;
      const d=v.axis==='NS'?v.dir*(u.py-v.py):v.dir*(u.px-v.px);
      if(d>0&&d<gap)gap=d;
    }
    gap-=v.len;
    const s0=v.isTruck?s0_trk:s0_car;
    let acc;
    if(mustStop){
      acc=-b0*2.5;
    } else {
      const deltaV=v.spd-(gap<900?v.spd*0.9:0);
      const sStar=s0+Math.max(0,v.spd*T+v.spd*deltaV/(2*Math.sqrt(a0*b0)));
      const gapAdj=Math.max(0.1,gap);
      acc=a0*(1-Math.pow(v.spd/Math.max(0.1,v.freeSpd),4)-(gap<9000?Math.pow(sStar/gapAdj,2):0));
      acc*=(1+impoliteness*0.4);
    }
    v.spd=Math.max(0,v.spd+acc*dt);

    if(junctionMode!=='roundabout'){
      const lx=g.lx, ly=g.ly;
      const inBox=v.px>=ixL&&v.px<=ixR&&v.py>=ixT&&v.py<=ixB;
      if(inBox&&!v.tr&&!v.turned&&v.intent&&v.intent!=='straight'){
        let ex,ey,ea={};
        if(v.axis==='NS'){
          if(v.dir<0){
            if(v.intent==='left'){ex=ixL;ey=ly[3];ea={axis:'EW',dir:-1,fixY:ly[3],laneId:'WB0'};}
            else                 {ex=ixR;ey=ly[2];ea={axis:'EW',dir:1, fixY:ly[2],laneId:'EB2'};}
          } else {
            if(v.intent==='left'){ex=ixR;ey=ly[2];ea={axis:'EW',dir:1, fixY:ly[2],laneId:'EB2'};}
            else                 {ex=ixL;ey=ly[3];ea={axis:'EW',dir:-1,fixY:ly[3],laneId:'WB0'};}
          }
        } else {
          if(v.dir>0){
            if(v.intent==='left'){ex=lx[2];ey=ixT;ea={axis:'NS',dir:-1,fixX:lx[2],laneId:'NB2'};}
            else                 {ex=lx[3];ey=ixB;ea={axis:'NS',dir:1, fixX:lx[3],laneId:'SB0'};}
          } else {
            if(v.intent==='right'){ex=lx[2];ey=ixT;ea={axis:'NS',dir:-1,fixX:lx[2],laneId:'NB2'};}
            else                  {ex=lx[3];ey=ixB;ea={axis:'NS',dir:1, fixX:lx[3],laneId:'SB0'};}
          }
        }
        if(ea.axis){
          v.tr={sx:v.px,sy:v.py,ex,ey,ea};
          v.laneId='_t'+v.id;
          v.fixX=null;v.fixY=null;
        }
      }
      if(v.tr){
        const tr=v.tr;
        const dx=tr.ex-v.px, dy=tr.ey-v.py, d=Math.hypot(dx,dy);
        const step=Math.max(0.5,(freeSpd/3.6)*0.55)*dt;
        if(d<=step+0.5){
          v.px=tr.ex;v.py=tr.ey;
          v.axis=tr.ea.axis;v.dir=tr.ea.dir;
          if(tr.ea.fixX!==undefined){v.fixX=tr.ea.fixX;v.fixY=null;}
          else{v.fixY=tr.ea.fixY;v.fixX=null;}
          v.laneId=tr.ea.laneId;
          v.angle=v.axis==='NS'?(v.dir>0?Math.PI/2:-Math.PI/2):(v.dir>0?0:Math.PI);
          v.turned=true;delete v.tr;
        } else {
          v.px+=step*(dx/d);v.py+=step*(dy/d);
          const tgt=Math.atan2(dy,dx);
          v.angle+=normAng(tgt-v.angle)*Math.min(1,dt*5);
        }
        v.spd=Math.min(v.freeSpd*0.55,(freeSpd/3.6)*0.48);
        if(v.spd<0.3)v.stopTime+=dt;else v.stopTime=0;
        if(v.px<-80||v.px>W+80||v.py<-80||v.py>H+80){v.active=false;passed++;}
        continue;
      }
    }
    if(junctionMode==='roundabout'){
      if(Math.hypot(v.px-cx,v.py-cy)<lw*3.1)v.spd=Math.min(v.spd,(freeSpd/3.6)*0.55);
      const el=lw*1.45,eb=lw*0.7;
      const approachingEntry=
        (v.axis==='NS'&&v.dir>0&&v.py>ixT-el-eb&&v.py<ixT-el+eb)||
        (v.axis==='NS'&&v.dir<0&&v.py<ixB+el+eb&&v.py>ixB+el-eb)||
        (v.axis==='EW'&&v.dir>0&&v.px>ixL-el-eb&&v.px<ixL-el+eb)||
        (v.axis==='EW'&&v.dir<0&&v.px<ixR+el+eb&&v.px>ixR+el-eb);
      if(approachingEntry&&!mustStop){
        const entryAngle=Math.atan2(v.py-cy,v.px-cx);
        const rbR=lw*2.75;
        let canEnter=true;
        for(const u of vehicles){
          if(u===v||!u.active||!u.rb)continue;
          if(angDist(u.rb.angle,entryAngle)<0.46){canEnter=false;break;}
        }
        if(!canEnter){
          v.spd=Math.min(v.spd,(freeSpd/3.6)*0.12);
        } else {
          const exitDelta=[Math.PI/2,Math.PI,Math.PI*1.5][Math.floor(Math.random()*3)];
          v.rb={angle:entryAngle,startAngle:entryAngle,exitDelta};
          v.px=cx+Math.cos(entryAngle)*rbR;
          v.py=cy+Math.sin(entryAngle)*rbR;
          v.spd=Math.min(v.spd,(freeSpd/3.6)*0.32);
        }
      }
    }
    if(v.axis==='NS'){v.py+=v.dir*v.spd*dt;if(v.fixX!==null)v.px=v.fixX;}
    else{v.px+=v.dir*v.spd*dt;if(v.fixY!==null)v.py=v.fixY;}
    if(closureStop){
      const cur=closureStop.axis==='NS'?v.py:v.px;
      if(closureStop.dir*(cur-closureStop.coord)>0){
        if(closureStop.axis==='NS')v.py=closureStop.coord;else v.px=closureStop.coord;
        v.spd=0;
      }
    }
    if(v.spd<0.3)v.stopTime+=dt;else v.stopTime=0;
    if(v.px<-80||v.px>W+80||v.py<-80||v.py>H+80){v.active=false;passed++;}
  }
  const laneGroups={};
  for(const v of vehicles){if(v.active)(laneGroups[v.laneId]??=[]).push(v);}
  const minQueueGap=lw*0.32;
  for(const laneId in laneGroups){
    const arr=laneGroups[laneId];
    arr.sort((a,b)=>{
      const pa=a.axis==='NS'?(a.dir*a.py):(a.dir*a.px);
      const pb=b.axis==='NS'?(b.dir*b.py):(b.dir*b.px);
      return pb-pa;
    });
    for(let i=1;i<arr.length;i++){
      const lead=arr[i-1], foll=arr[i];
      const pLead=lead.axis==='NS'?(lead.dir*lead.py):(lead.dir*lead.px);
      const pFoll=foll.axis==='NS'?(foll.dir*foll.py):(foll.dir*foll.px);
      const minCenterGap=(lead.len+foll.len)*0.5+minQueueGap;
      if(pLead-pFoll<minCenterGap){
        const fixedP=pLead-minCenterGap;
        if(foll.axis==='NS')foll.py=fixedP*foll.dir;
        else foll.px=fixedP*foll.dir;
        foll.spd=Math.min(foll.spd,lead.spd);
      }
    }
  }
  if(vehicles.length>400)vehicles=vehicles.filter(v=>v.active);
}

function updateMetricsUI(){
  let n=0,spdSum=0,waitSum=0,stopN=0;
  for(const v of vehicles){
    if(!v.active)continue;
    n++;spdSum+=v.spd;waitSum+=v.stopTime;
    if(v.spd<0.3)stopN++;
  }
  const thru=simT>1?(passed/(simT/3600)):0;
  document.getElementById('m-active').textContent=String(n);
  document.getElementById('m-spd').textContent=`${n?(spdSum/n*3.6).toFixed(1):0} km/h`;
  document.getElementById('m-thru').textContent=`${Math.round(thru)} /h`;
  document.getElementById('m-wait').textContent=`${n?(waitSum/n).toFixed(1):0} s`;
  document.getElementById('m-stop').textContent=String(stopN);
}

function adjustL(hex,amt){
  const n=parseInt(hex.replace('#',''),16);
  return `rgb(${Math.min(255,(n>>16)+amt)},${Math.min(255,((n>>8)&0xff)+amt)},${Math.min(255,(n&0xff)+amt)})`;
}

function drawVehicles(g){
  for(const v of vehicles){
    if(!v.active)continue;
    ctx.save();ctx.translate(v.px,v.py);ctx.rotate(v.angle);
    if(v.isTruck){
      ctx.fillStyle='rgba(0,0,0,0.32)';ctx.fillRect(-v.len/2+3,-v.wid/2+3,v.len,v.wid);
      ctx.fillStyle=v.color;ctx.fillRect(-v.len/2,-v.wid/2,v.len*0.72,v.wid);
      ctx.fillStyle=adjustL(v.color,20);ctx.fillRect(v.len*0.22,-v.wid/2,v.len*0.28,v.wid);
      ctx.fillStyle='rgba(140,190,220,0.75)';ctx.fillRect(v.len*0.26,-v.wid/2+1.5,v.len*0.16,v.wid-3);
      ctx.fillStyle='#fff8d0';ctx.fillRect(v.len/2-2,-v.wid/2+2,2,3);ctx.fillRect(v.len/2-2,v.wid/2-5,2,3);
    } else {
      ctx.fillStyle='rgba(0,0,0,0.28)';ctx.fillRect(-v.len/2+2,-v.wid/2+2,v.len,v.wid);
      ctx.fillStyle=v.color;ctx.fillRect(-v.len/2,-v.wid/2,v.len,v.wid);
      ctx.fillStyle='rgba(155,205,235,0.78)';ctx.fillRect(-v.len/2+v.len*0.13,-v.wid/2+1,v.len*0.27,v.wid-2);
      ctx.fillStyle='rgba(135,185,215,0.6)';ctx.fillRect(v.len/2-v.len*0.25,-v.wid/2+1,v.len*0.2,v.wid-2);
      ctx.fillStyle='#fffcd0';ctx.fillRect(v.len/2-2,-v.wid/2+1,2,2.5);ctx.fillRect(v.len/2-2,v.wid/2-3.5,2,2.5);
      ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fillRect(-v.len/2+v.len*0.25,-v.wid/2+1.5,v.len*0.45,v.wid-3);
    }
    ctx.restore();
  }
}

function drawIdOverlays(g){
  if(!showIds&&!showVids)return;
  const {ixL,ixR,ixT,ixB,lw}=g;
  const mono=getComputedStyle(document.documentElement).getPropertyValue('--mono');
  if(showIds){
    const lanes=makeLanes(g);
    ctx.save();
    ctx.font=`${Math.max(9,lw*0.5)}px ${mono}`;
    ctx.textAlign='center';ctx.textBaseline='middle';
    for(const lane of lanes){
      const isNS=lane.axis==='NS';
      const x=isNS?lane.x:(lane.dir>0?ixL-lw*1.9:ixR+lw*1.9);
      const y=isNS?(lane.dir>0?ixT-lw*1.7:ixB+lw*1.7):lane.y;
      ctx.fillStyle='rgba(20,20,18,0.72)';ctx.fillRect(x-lw*0.9,y-lw*0.48,lw*1.8,lw*0.95);
      ctx.fillStyle='rgba(255,238,198,0.94)';ctx.fillText(lane.id,x,y);
    }
    if(junctionMode==='roundabout'){
      const rx=(ixL+ixR)/2,ry=(ixT+ixB)/2;
      ctx.fillStyle='rgba(20,20,18,0.72)';ctx.fillRect(rx-lw*1.0,ry-lw*0.5,lw*2.0,lw*1.0);
      ctx.fillStyle='rgba(255,238,198,0.94)';ctx.fillText('RB',rx,ry);
    }
    ctx.restore();
  }
  if(showVids){
    ctx.save();
    ctx.font=`${Math.max(9,lw*0.48)}px ${mono}`;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    for(const v of vehicles){
      if(!v.active)continue;
      ctx.fillStyle='rgba(10,10,10,0.7)';
      ctx.fillRect(v.px-lw*0.42,v.py-v.len*0.35-lw*0.78,lw*0.84,lw*0.62);
      ctx.fillStyle='rgba(240,240,230,0.95)';
      ctx.fillText(String(v.id),v.px,v.py-v.len*0.35-lw*0.18);
    }
    ctx.restore();
  }
}

function drawClosureMarkers(g){
  if(junctionMode!=='intersection')return;
  const {ixL,ixR,ixT,ixB,lw}=g;
  const laneById=Object.fromEntries(makeLanes(g).map(l=>[l.id,l]));
  const bw=lw*0.9,bh=lw*0.58;
  const mono=getComputedStyle(document.documentElement).getPropertyValue('--mono');
  for(const laneId of Object.values(closureMode)){
    if(!laneId)continue;
    const m=LANE_META[laneId],lane=laneById[laneId];
    if(!m||!lane)continue;
    const mx=m.axis==='NS'?lane.x:(m.dir>0?ixL-lw*1.2:ixR+lw*1.2);
    const my=m.axis==='NS'?(m.dir>0?ixT-lw*1.0:ixB+lw*1.0):lane.y;
    const rot=m.axis==='NS'?0:Math.PI/2;
    ctx.save();ctx.translate(mx,my);ctx.rotate(rot);
    ctx.fillStyle='rgba(25,22,18,0.85)';ctx.fillRect(-bw*0.54,-bh*0.68,bw*1.08,bh*1.36);
    ctx.fillStyle='#d67c28';ctx.fillRect(-bw*0.5,-bh*0.5,bw,bh);
    ctx.strokeStyle='rgba(45,25,12,0.9)';ctx.lineWidth=1;ctx.strokeRect(-bw*0.5,-bh*0.5,bw,bh);
    ctx.strokeStyle='rgba(255,240,200,0.9)';ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(-bw*0.42,bh*0.36);ctx.lineTo(-bw*0.18,-bh*0.36);
    ctx.moveTo(-bw*0.08,bh*0.36);ctx.lineTo(bw*0.16,-bh*0.36);
    ctx.moveTo(bw*0.26,bh*0.36);ctx.lineTo(bw*0.5,-bh*0.36);
    ctx.stroke();
    ctx.fillStyle='rgba(255,245,220,0.96)';
    ctx.font=`${Math.max(8,lw*0.36)}px ${mono}`;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('WORK',0,0);
    ctx.restore();
  }
}

let last=null;
function loop(ts){
  if(!last)last=ts;
  const rawDt=Math.min((ts-last)/1000,0.05);last=ts;
  if(playing){
    const dt=rawDt*tlapse;simT+=dt;
    if(scenario==='signals'){tlClock+=dt;if(tlClock>=TL_TIMES[tlPhase]){tlClock=0;tlPhase=(tlPhase+1)%4;}}
    updateVehicles(dt,geo());
    document.getElementById('timer').textContent='T = '+Math.floor(simT)+' s';
  }
  const g=geo();
  drawTerrain();drawBuildings();drawRoads();drawMarkings();drawFurniture();drawPlaceLabels();
  drawSignalHeads(g);drawClosureMarkers(g);drawVehicles(g);drawIdOverlays(g);
  updateMetricsUI();
  requestAnimationFrame(loop);
}

let showIds=false, showVids=false;
function pillsOff(sel){document.querySelectorAll(sel).forEach(b=>b.classList.remove('on'));}
function togglePlay(){playing=!playing;document.getElementById('ob-play').textContent=playing?'⏸ PAUSE':'▶ PLAY';document.getElementById('ob-play').classList.toggle('lit',!playing);}
function toggleIds(){showIds=!showIds;document.getElementById('ob-ids').classList.toggle('lit',showIds);}
function toggleVids(){showVids=!showVids;document.getElementById('ob-vid').classList.toggle('lit',showVids);}
function resetSim(){vehicles=[];vid=0;simT=0;passed=0;tlPhase=0;tlClock=0;spawnAcc={};document.getElementById('timer').textContent='T = 0 s';updateMetricsUI();}
function sv(id,val){document.getElementById(id).textContent=val;}
requestAnimationFrame(loop);

function syncLaneClosureUI(){
  for(const [side,laneId] of Object.entries(closureMode)){
    document.querySelectorAll(`#closure-${side} .pill`).forEach(btn=>{
      btn.classList.toggle('on',btn.dataset.lane===(laneId||''));
    });
  }
}
function setClosureMode(btn,side,laneId){
  if(closureMode[side]===laneId)return;
  closureMode[side]=laneId;syncLaneClosureUI();resetSim();
}
function setScenario(btn,sc){
  if(junctionMode==='roundabout'&&sc==='signals')return;
  scenario=sc;
  pillsOff('#scenario-pills .pill');
  btn.classList.add('on');
  tlPhase=0;tlClock=0;
}
function updateControlUI(){
  const signalBtn=document.getElementById('sc-signals');
  const sliders=document.querySelector('.tl-sliders');
  if(junctionMode==='roundabout'){
    signalBtn.style.display='none';sliders.style.display='none';
    if(scenario==='signals'){
      scenario='priority';
      pillsOff('#scenario-pills .pill');
      document.getElementById('sc-priority').classList.add('on');
    }
  } else {
    signalBtn.style.display='';sliders.style.display='';
  }
  syncLaneClosureUI();
}
function setJunction(btn,mode){
  const modeChanged=junctionMode!==mode;
  junctionMode=mode;
  pillsOff('#junction-pills .pill');
  btn.classList.add('on');
  if(mode==='roundabout'){
    if(scenario==='signals'){
      scenario='priority';
      pillsOff('#scenario-pills .pill');
      document.getElementById('sc-priority').classList.add('on');
    }
  } else if(mode==='intersection'&&scenario==='priority'){
    scenario='signals';
    pillsOff('#scenario-pills .pill');
    document.getElementById('sc-signals').classList.add('on');
    tlPhase=0;tlClock=0;
  }
  if(modeChanged)resetSim();
  updateControlUI();
}

updateControlUI();
