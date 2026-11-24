const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const still = matchMedia('(prefers-reduced-motion: reduce)');
let frame;
function paint(time = 0) {
  const width = canvas.clientWidth, height = canvas.clientHeight;
  const scale = Math.min(width / 530, height / 370);
  const dpr = Math.min(devicePixelRatio, 2);
  if (canvas.width !== Math.round(width*dpr) || canvas.height !== Math.round(height*dpr)) {
    canvas.width = Math.round(width*dpr); canvas.height = Math.round(height*dpr);
  }
  ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,width,height);
  ctx.translate(width/2,height/2); ctx.scale(scale,scale);
  ctx.fillStyle='#bfdcde';
  for(let x=-400;x<400;x+=14) for(let y=-280;y<280;y+=14) ctx.fillRect(x,y,1.4,1.4);
  function diamond(size, lift, fill, edge) {
    ctx.beginPath(); [[0,-size*.52],[size,0],[0,size*.52],[-size,0]].forEach(([x,y],i)=>i?ctx.lineTo(x,y+lift):ctx.moveTo(x,y+lift));
    ctx.closePath(); ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=edge;ctx.stroke();
  }
  for(const sign of [-1,1]) for(const side of [-1,1]) for(let i=0;i<7;i++){
    const x=sign*(64-i*6), y=side*(15+i*4);
    const points=[[x,y],[x+sign*65,y+side*34],[x+sign*(100+i*5),y+side*34],[x+sign*(150+i*6),y+side*(60+i*7)]];
    ctx.beginPath();points.forEach(([a,b],j)=>j?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.strokeStyle='#89bdc4';ctx.stroke();
    const [a,b]=points[3];ctx.fillStyle='#359eae';ctx.beginPath();ctx.arc(a,b,2.7,0,Math.PI*2);ctx.fill();
    const progress=((time/1700+i*.47)%3),j=Math.floor(progress),f=progress-j;
    ctx.fillRect(points[j][0]*(1-f)+points[j+1][0]*f,points[j][1]*(1-f)+points[j+1][1]*f,3,3);
  }
  diamond(108,22,'#b9d8dc','#8ab9bf');diamond(108,14,'#fff','#8ab9bf');
  diamond(99,4,'#245158','#245158');diamond(99,-4,'#16373d','#245158');
  diamond(91,-12,'#253f45','#5e8286');
  ctx.save();ctx.transform(.90,.46,-.90,.46,0,-15);ctx.lineWidth=3.8;ctx.strokeStyle='#75d8e5';
  ctx.beginPath();ctx.arc(0,-4,26,0,Math.PI);ctx.stroke();
  for(const [x,y] of [[-27,-9],[0,17],[27,-9]]){ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fillStyle='#253f45';ctx.fill();ctx.stroke()}ctx.restore();
  if(!still.matches && !document.hidden) frame=requestAnimationFrame(paint);
}
function restart(){cancelAnimationFrame(frame);paint()}
new ResizeObserver(restart).observe(canvas);document.addEventListener('visibilitychange',restart);still.addEventListener('change',restart);
for(const form of document.forms) form.addEventListener('submit',async event=>{
  event.preventDefault();
  const button=form.querySelector('button'), status=form.querySelector('output');
  button.disabled=true;status.textContent='Enviando…';
  try {
    const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
    const data=await response.json();status.textContent=data.mensaje;
    if(response.ok)form.reset();
  } catch {status.textContent='No pudimos confirmar el envío. Puedes escribirnos a hola@mednologyapps.com.'}
  finally {button.disabled=false}
});
