(function(){
  var input=document.getElementById('q');
  var out=document.getElementById('search-results');
  var fallback=document.getElementById('catalog-fallback');
  if(!input||!out)return;
  var data=null,loading=false;
  function fmt(n){return(''+n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');}
  function esc(s){return(''+s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function render(q){
    q=(q||'').trim().toLowerCase();
    if(!q){out.innerHTML='';out.hidden=true;if(fallback)fallback.hidden=false;return;}
    if(fallback)fallback.hidden=true;out.hidden=false;
    if(!data){out.innerHTML='<p class="loading">Загрузка…</p>';return;}
    var res=[];
    for(var i=0;i<data.length&&res.length<80;i++){
      var d=data[i];
      if(d.name.toLowerCase().indexOf(q)>=0||(d.city&&d.city.toLowerCase().indexOf(q)>=0))res.push(d);
    }
    if(!res.length){out.innerHTML='<p class="noresults">Ничего не найдено по запросу «'+esc(q)+'».</p>';return;}
    var h='<ul class="vuz-list">';
    for(var j=0;j<res.length;j++){
      var d=res[j],meta=[];
      if(d.city)meta.push(esc(d.city));
      if(d.ms!=null)meta.push('от '+d.ms+' баллов');
      if(d.mp!=null)meta.push('от '+fmt(d.mp)+' ₽/год');
      h+='<li><a href="/vuz/'+d.slug+'.html">'+esc(d.name)+'</a>'+
        (meta.length?' <span class="m">— '+meta.join(' · ')+'</span>':'')+'</li>';
    }
    out.innerHTML=h+'</ul>';
  }
  function load(cb){
    if(data||loading){cb&&cb();return;}
    loading=true;
    fetch('/search-index.json').then(function(r){return r.json();}).then(function(j){
      data=j;loading=false;cb&&cb();
    }).catch(function(){loading=false;out.innerHTML='<p class="noresults">Не удалось загрузить индекс поиска.</p>';});
  }
  input.addEventListener('input',function(){
    var q=input.value;
    if(!data){load(function(){render(q);});render(q);}else render(q);
  });
})();
