const menu=document.querySelector('.mobile-menu');menu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.open=false}));document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu?.open){menu.open=false;menu.querySelector('summary').focus()}});
function openLinkedCase(){const target=document.getElementById(location.hash.slice(1));if(target?.matches('details.study'))target.open=true;}
document.querySelectorAll('#areas a[href^="#caso-"]').forEach(link=>link.addEventListener('click',()=>{const target=document.getElementById(link.hash.slice(1));if(target)target.open=true;}));
window.addEventListener('hashchange',openLinkedCase);
openLinkedCase();
