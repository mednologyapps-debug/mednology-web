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
