/* Campus Explorer – all app logic.
   Sections: 1 data & storage, 2 helpers, 3 public rendering, 4 modals & registration, 5 admin, 6 events/startup.
   All sample content is DEMO content. LocalStorage is NOT secure authentication. */

/* ===== 1. DATA & STORAGE ===== */
const KEY='campus_explorer_v2';
const FILTERS=[['All',''],['Technology','technology'],['Cultural','cultural'],['Sports','sports'],['Development','development'],['Workshops','workshop'],['Automotive','automotive'],['Media','media']];
const CLUB_CATS=['Technology','AI & Machine Learning','Development','Automotive','Cultural','Entrepreneurship','Sports','Photography & Media'];
const EVENT_CATS=['Workshop','Hackathon','Technology','Development','Cultural','Sports','Automotive','Media'];
const RES_CATS=['Academic Resources','Learning Materials','Developer Communities','Programming Practice','Useful Websites','Campus Information','Career Development'];
const RES_ICON={'Academic Resources':'graduation-cap','Learning Materials':'book-open','Developer Communities':'users','Programming Practice':'terminal','Useful Websites':'globe','Campus Information':'map-pin','Career Development':'briefcase'};

function seedData(){
  const day=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
  // [name, category, short, activities, skills, tags, icon]
  const C=[['GDG – Google Developer Groups','Technology','Developer community around Google technologies.',['Study jams','Tech talks','Workshops'],['Web','Android','Cloud basics'],['Technology','Development','Google'],'code'],
   ['Student Council','Cultural','Student representation and campus leadership.',['Campus drives','Student feedback meetings'],['Leadership','Teamwork'],['Leadership','Community'],'landmark'],
   ['Eklavya','Media','Multimedia and creative community.',['Video projects','Design sessions'],['Editing','Storytelling'],['Media','Creative'],'film'],
   ['Aroha','Cultural','Cultural community for arts and performance.',['Cultural nights','Art showcases'],['Performance','Event planning'],['Cultural','Arts'],'palette'],
   ['Velos','Automotive','Club for car and automobile enthusiasts.',['Car culture meets','Engineering talks'],['Vehicle basics','Design thinking'],['Automotive','Cars','Engineering'],'car'],
   ['AI & Machine Learning Club','AI & Machine Learning','Learn and apply AI and ML.',['Bootcamps','Paper reading'],['Python','ML basics'],['Technology','AI','Python'],'brain'],
   ['Robotics Club','Technology','Build and program robots.',['Robot builds','Workshops'],['Electronics','Programming'],['Technology','Robotics'],'bot'],
   ['Entrepreneurship Club','Entrepreneurship','Startups, ideas and pitching.',['Pitch nights','Founder talks'],['Pitching','Business basics'],['Business','Startups'],'lightbulb'],
   ['Photography & Media Club','Photography & Media','Photo walks, editing and exhibitions.',['Photo walks','Exhibitions'],['Photography','Editing'],['Media','Photography'],'camera'],
   ['Sports Club','Sports','Teams, tournaments and fitness.',['Tournaments','Training'],['Teamwork','Fitness'],['Sports','Fitness'],'dumbbell']];
  const clubs=C.map((c,i)=>({id:'c'+(i+1),name:c[0],category:c[1],short:c[2],detail:c[2]+' This is demo content; the owner can replace it in the admin dashboard.',activities:c[3],skills:c[4],tags:c[5],icon:c[6],image:'',instagram:'',website:'',email:'',demo:true}));
  // [title, category, offset, time, venue, description]
  const E=[['Web Development Workshop','Workshop',9,'2:00 PM','Lab 1 (sample)','Build a small website with HTML, CSS and JavaScript.'],
   ['AI/ML Bootcamp','Technology',16,'9:30 AM','Lab 2 (sample)','Introduction to machine learning with Python.'],
   ['Campus Hackathon','Hackathon',28,'9:00 AM','Auditorium (sample)','Team-based build event.'],
   ['Technical Ideathon','Technology',21,'11:00 AM','Room 204 (sample)','Pitch and refine technical ideas.'],
   ['UI/UX Design Workshop','Workshop',14,'11:00 AM','Studio (sample)','From wireframes to a clickable prototype.'],
   ['GDG Developer Session','Development',-12,'4:00 PM','Seminar Hall (sample)','Developer talks and demos.']];
  const events=E.map((e,i)=>({id:'e'+(i+1),title:e[0],category:e[1],date:day(e[2]),time:e[3],venue:e[4],description:e[5],regInfo:'Demo registration form on this site.',status:e[2]<0?'completed':'upcoming',demo:true}));
  // [title, category, url, description]
  const R=[['NPTEL','Academic Resources','https://nptel.ac.in','Free university-level courses.'],['freeCodeCamp','Learning Materials','https://www.freecodecamp.org','Free coding lessons.'],
   ['MDN Web Docs','Learning Materials','https://developer.mozilla.org','Web platform documentation.'],['GDG Community','Developer Communities','https://developers.google.com/community/gdg','Google developer communities.'],
   ['LeetCode','Programming Practice','https://leetcode.com','Practice coding problems.'],['HackerRank','Programming Practice','https://www.hackerrank.com','Challenges and skill tests.'],
   ['Wikipedia','Useful Websites','https://www.wikipedia.org','Quick background reading.'],['Campus info (add your link)','Campus Information','','Owner: add your college website in Admin.'],
   ['Internshala','Career Development','https://internshala.com','Internship listings.']];
  return{clubs,events,resources:R.map((r,i)=>({id:'r'+(i+1),title:r[0],category:r[1],url:r[2],description:r[3]})),regs:[],
    settings:{heroTitle:'Your Campus. Your Community. Your Experience.',heroText:'Discover the people, clubs, events, and opportunities that make college life extraordinary.',heroImage:'',about:'Campus Explorer helps students find clubs, events and resources in one place. This site is a frontend demo; the owner can edit its content from the Admin dashboard.',email:'',instagram:'',github:''}};
}
function loadData(){try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.clubs&&d.settings)return d}catch(e){}const d=seedData();localStorage.setItem(KEY,JSON.stringify(d));return d}
let db=loadData();
function saveData(){try{localStorage.setItem(KEY,JSON.stringify(db));return true}catch(e){toast('Storage is full. Use a smaller image or an image link.');return false}}
const ui={q:'',filter:'',tab:'overview'};

/* ===== 2. HELPERS ===== */
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons=()=>window.lucide&&lucide.createIcons();
const fmtDate=d=>d?new Date(d+'T00:00').toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}):'Date TBA';
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.id);toast.id=setTimeout(()=>t.classList.remove('show'),2800)}
/* Search: every word typed must appear somewhere in the item's text (case-insensitive). */
const matchSearch=(...f)=>{const t=f.join(' ').toLowerCase();return ui.q.toLowerCase().split(/\s+/).filter(Boolean).every(w=>t.includes(w))};
/* Filter: the chosen keyword must appear in the category or tags. Works together with search. */
const matchFilter=it=>!ui.filter||(it.category+' '+(it.tags||[]).join(' ')).toLowerCase().includes(ui.filter);
const media=it=>it.image?`<img class="ph" src="${esc(it.image)}" alt="${esc(it.name||it.title)}" loading="lazy">`:`<div class="ph" aria-hidden="true"><i data-lucide="${esc(it.icon||'sparkles')}"></i></div>`;
const demoTag=it=>it.demo?'<span class="tag demo">Demo</span>':'';
const grid=(list,fn,msg)=>list.length?list.map(fn).join(''):`<div class="empty">${msg}</div>`;

/* ===== 3. PUBLIC RENDERING ===== */
const clubCard=c=>`<article class="card">${media(c)}<div class="body"><div><span class="tag">${esc(c.category)}</span>${demoTag(c)}</div><h3>${esc(c.name)}</h3><p>${esc(c.short)}</p>
  <div>${c.tags.slice(0,3).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div><div class="btns"><button class="btn small" data-act="club" data-id="${c.id}">View Details</button></div></div></article>`;
const eventCard=e=>`<article class="card"><div class="body"><div><span class="tag ${e.status}">${e.status}</span><span class="tag">${esc(e.category)}</span>${demoTag(e)}</div><h3>${esc(e.title)}</h3>
  <p><i data-lucide="calendar"></i> ${fmtDate(e.date)} · ${esc(e.time)}</p><p><i data-lucide="map-pin"></i> ${esc(e.venue)}</p><p>${esc(e.description)}</p>
  <div class="btns"><button class="btn small alt" data-act="event" data-id="${e.id}">Details</button><button class="btn small" data-act="register" data-id="${e.id}" ${e.status!=='upcoming'?'disabled':''}>Register</button></div></div></article>`;
const resCard=r=>`<article class="card"><div class="body"><i data-lucide="${RES_ICON[r.category]||'link'}"></i><span class="tag">${esc(r.category)}</span><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p>
  <div class="btns">${r.url?`<a class="btn small" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Visit Resource</a>`:'<button class="btn small" disabled>Link not set</button>'}</div></div></article>`;

function renderHero(){
  const s=db.settings;$('#heroTitle').textContent=s.heroTitle;$('#heroText').textContent=s.heroText;$('#aboutText').textContent=s.about;
  $('#heroMedia').innerHTML=s.heroImage?`<img src="${esc(s.heroImage)}" alt="Campus life">`:'<div class="ph" aria-hidden="true"><i data-lucide="graduation-cap"></i></div>';
  const comm=new Set(db.clubs.map(c=>c.category)).size;
  $('#heroStats').innerHTML=[[db.clubs.length,'Clubs'],[db.events.length,'Events'],[comm,'Communities']].map(x=>`<div><b>${x[0]}</b><span>${x[1]} (demo count)</span></div>`).join('');
  const links=[['email',s.email&&'mailto:'+s.email,'Email'],['instagram',s.instagram,'Instagram'],['github',s.github,'GitHub']].filter(l=>l[1]);
  $('#footLinks').innerHTML=links.map(l=>`<a href="${esc(l[1])}" target="_blank" rel="noopener noreferrer">${l[2]}</a>`).join(' · ');
}
function renderFilters(){$('#chips').innerHTML=FILTERS.map(f=>`<button data-act="filter" data-v="${f[1]}" aria-pressed="${ui.filter===f[1]}" class="${ui.filter===f[1]?'on':''}">${f[0]}</button>`).join('')}
function renderLists(){
  $('#clubGrid').innerHTML=grid(db.clubs.filter(c=>matchFilter(c)&&matchSearch(c.name,c.short,c.detail,c.category,c.tags.join(' '))),clubCard,'No clubs found. Try another word or choose "All".');
  const ev=db.events.filter(e=>matchFilter(e)&&matchSearch(e.title,e.category,e.description,e.venue)).sort((a,b)=>a.date.localeCompare(b.date));
  $('#eventGrid').innerHTML=grid(ev,eventCard,'No events found. Try another word or choose "All".');
  $('#resGrid').innerHTML=grid(db.resources.filter(r=>matchSearch(r.title,r.description,r.category)),resCard,'No resources found. (Category filters apply to clubs and events only.)');
  icons();
}
function renderAll(){renderHero();renderFilters();renderLists();if(!$('#adminView').hidden)renderAdmin();icons()}

/* ===== 4. MODALS & REGISTRATION (one reusable dialog) ===== */
function openModal(html){$('#modalBody').innerHTML=html;icons();document.body.classList.add('lock');if(!$('#modal').open)$('#modal').showModal()}
const list=a=>a&&a.length?`<ul>${a.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p>Not added yet.</p>';
function clubModal(c){
  const links=[[c.instagram,'Instagram'],[c.website,'Website'],[c.email&&'mailto:'+c.email,'Email']].filter(l=>l[0]);
  openModal(`${media(c)}<h2 id="mTitle" style="margin-top:14px">${esc(c.name)}</h2><p><span class="tag">${esc(c.category)}</span>${c.demo?'<span class="tag demo">Demo content</span>':''}</p><p>${esc(c.detail)}</p>
  <h3>Activities</h3>${list(c.activities)}<h3>Skills you can learn</h3>${list(c.skills)}<h3>Contact</h3>${links.length?links.map(l=>`<a class="btn small alt" href="${esc(l[0])}" target="_blank" rel="noopener noreferrer">${l[1]}</a> `).join(''):'<p>No contact links added.</p>'}`);
}
function eventModal(e){
  openModal(`<h2 id="mTitle">${esc(e.title)}</h2><p><span class="tag ${e.status}">${e.status}</span><span class="tag">${esc(e.category)}</span>${e.demo?'<span class="tag demo">Demo event</span>':''}</p>
  <p><b>${fmtDate(e.date)}</b> · ${esc(e.time)}<br>${esc(e.venue)}</p><p>${esc(e.description)}</p><p><b>Registration:</b> ${esc(e.regInfo)}</p>
  <button class="btn" data-act="register" data-id="${e.id}" ${e.status!=='upcoming'?'disabled':''}>Register</button>`);
}
function registerModal(id){
  const open=db.events.filter(e=>e.status==='upcoming');
  openModal(`<h2 id="mTitle">Register for an event</h2><div class="note">Frontend demo: your details are saved in this browser only and are not sent to any organiser or server.</div>
  <form class="f" id="regForm" novalidate style="margin-top:14px"><label>Student name<input name="name" autocomplete="name"></label>
  <label>Email address<input name="email" type="email" autocomplete="email"></label><label>College / Department<input name="dept"></label>
  <label>Event<select name="event">${open.map(e=>`<option value="${e.id}" ${e.id===id?'selected':''}>${esc(e.title)}</option>`).join('')}</select></label>
  <p class="err" id="regErr" role="alert"></p><button class="btn">Submit registration</button></form>`);
}
function submitRegistration(f){
  const v={name:f.name.value.trim(),email:f.email.value.trim(),dept:f.dept.value.trim(),event:f.event.value};
  if(!v.name||!v.email||!v.dept||!v.event){$('#regErr').textContent='Please complete every field.';return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)){$('#regErr').textContent='Enter a valid email address, like name@example.com.';return}
  db.regs.push({...v,at:new Date().toISOString()});saveData();
  const ev=db.events.find(e=>e.id===v.event);
  openModal(`<h2 id="mTitle">You're registered (demo)</h2><p>Thanks, ${esc(v.name)}. Your interest in <b>${esc(ev?ev.title:'the event')}</b> was recorded in this browser only. No organiser has received it.</p><button class="btn" data-act="closeModal">Close</button>`);
  toast('Registration saved (demo)');
}

/* ===== 5. ADMIN DASHBOARD ===== */
// Each field: [key, label, type, options]. One generic form + table handles clubs, events and resources.
const SCHEMAS={
 clubs:{one:'club',title:'name',fields:[['name','Club name','text'],['category','Category','select',CLUB_CATS],['short','Short description','textarea'],['detail','Full description','textarea'],['activities','Activities (one per line)','lines'],['skills','Skills students learn (one per line)','lines'],['tags','Tags (one per line)','lines'],['image','Club image','image'],['instagram','Instagram link','url'],['website','Website link','url'],['email','Contact email','email']]},
 events:{one:'event',title:'title',fields:[['title','Event name','text'],['category','Category','select',EVENT_CATS],['date','Date','date'],['time','Time','text'],['venue','Venue','text'],['description','Description','textarea'],['regInfo','Registration information','text'],['status','Status','select',['upcoming','completed','cancelled']]]},
 resources:{one:'resource',title:'title',fields:[['title','Title','text'],['category','Category','select',RES_CATS],['url','Link','url'],['description','Description','textarea']]},
 settings:{fields:[['heroTitle','Hero heading','text'],['heroText','Hero description','textarea'],['heroImage','Hero image','image'],['about','About section','textarea'],['email','Contact email','email'],['instagram','Instagram link','url'],['github','GitHub link','url']]}};

function fieldHTML([k,l,t,o],v){
  if(t==='textarea')return `<label>${l}<textarea name="${k}" rows="3">${esc(v)}</textarea></label>`;
  if(t==='lines')return `<label>${l}<textarea name="${k}" rows="3">${esc((v||[]).join('\n'))}</textarea></label>`;
  if(t==='select')return `<label>${l}<select name="${k}">${o.map(x=>`<option ${x===v?'selected':''}>${esc(x)}</option>`).join('')}</select></label>`;
  if(t==='image')return `<label>${l} (paste a link, or upload a file under 400 KB)<input name="${k}" id="img-${k}" value="${esc(v)}" placeholder="https://…"></label><input type="file" accept="image/*" data-file="${k}" aria-label="Upload ${l}"><img class="prev" id="prev-${k}" alt="Image preview" ${v?`src="${esc(v)}"`:'hidden'}>`;
  return `<label>${l}<input name="${k}" type="${t}" value="${esc(v)}" ${t==='text'&&(k==='name'||k==='title')||t==='date'?'required':''}></label>`;
}
function readForm(fields,form,base){
  const out={...base};
  fields.forEach(([k,,t])=>{const v=form.elements[k].value;out[k]=t==='lines'?v.split('\n').map(x=>x.trim()).filter(Boolean):v.trim()});
  return out;
}
function renderAdmin(){
  const tabs=['overview','clubs','events','resources','settings'];let body='';
  if(ui.tab==='overview'){
    const up=db.events.filter(e=>e.status==='upcoming').length;
    body=`<div class="tiles"><div class="tile"><b>${db.clubs.length}</b>Total clubs</div><div class="tile"><b>${db.events.length}</b>Total events</div><div class="tile"><b>${up}</b>Upcoming events</div><div class="tile"><b>${db.resources.length}</b>Total resources</div><div class="tile"><b>${db.regs.length}</b>Demo registrations</div></div>
    <p class="note" style="margin-top:20px"><b>Security note:</b> this dashboard has no real login. LocalStorage lives in this browser only and anyone with the page can open it. A real public admin needs backend authentication, authorization and a database.</p>
    <p><button class="btn danger" data-adm="reset">Reset demo data</button></p>`;
  }else if(ui.tab==='settings'){
    body=`<form class="f" id="settingsForm">${SCHEMAS.settings.fields.map(f=>fieldHTML(f,db.settings[f[0]])).join('')}<div><button class="btn">Save settings</button></div></form>`;
  }else{
    const s=SCHEMAS[ui.tab];
    body=`<p><button class="btn" data-adm="new">Add ${s.one}</button></p><div class="tablewrap"><table><thead><tr><th>Name</th><th>Category</th><th>Actions</th></tr></thead><tbody>${db[ui.tab].map(x=>`<tr><td>${esc(x[s.title])}</td><td>${esc(x.category)}</td><td><button class="btn small alt" data-adm="edit" data-id="${x.id}">Edit</button> <button class="btn small danger" data-adm="del" data-id="${x.id}">Delete</button></td></tr>`).join('')||'<tr><td colspan="3">Nothing here yet. Add the first one.</td></tr>'}</tbody></table></div>`;
  }
  $('#adminBody').innerHTML=`<div class="row"><h1>Manage website</h1><a class="btn small alt" href="#home">View site</a></div><div class="tabs">${tabs.map(t=>`<button data-adm="tab" data-id="${t}" class="${ui.tab===t?'on':''}">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}</div>${body}`;
  icons();
}
function adminForm(id){
  const s=SCHEMAS[ui.tab],it=id?db[ui.tab].find(x=>x.id===id):{};
  openModal(`<h2 id="mTitle">${id?'Edit':'Add'} ${s.one}</h2><form class="f" id="itemForm" data-id="${id||''}">${s.fields.map(f=>fieldHTML(f,it[f[0]]??'')).join('')}<div><button class="btn">Save ${s.one}</button></div></form>`);
}
function saveItem(form){
  const s=SCHEMAS[ui.tab],id=form.dataset.id,list=db[ui.tab];
  if(id){const i=list.findIndex(x=>x.id===id);list[i]=readForm(s.fields,form,list[i]);list[i].demo=false}
  else list.unshift({...readForm(s.fields,form,{id:ui.tab[0]+Date.now().toString(36),demo:false,tags:[],activities:[],skills:[]})});
  if(saveData()){$('#modal').close();renderAll();toast(s.one[0].toUpperCase()+s.one.slice(1)+' saved')}
}
function adminAction(a,id){
  if(a==='tab')ui.tab=id;
  if(a==='new')return adminForm(null);
  if(a==='edit')return adminForm(id);
  if(a==='del'){if(!confirm('Delete this item? This cannot be undone.'))return;db[ui.tab]=db[ui.tab].filter(x=>x.id!==id);saveData();toast('Deleted')}
  if(a==='reset'){if(!confirm('Replace everything with the demo data?'))return;db=seedData();saveData();toast('Demo data restored')}
  renderAll();
}

/* ===== 6. EVENTS & STARTUP ===== */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act],[data-adm]');
  if(!b){if(e.target.id==='modal')$('#modal').close();return}  // click on dark backdrop closes modal
  const {act,adm,id}=b.dataset;
  if(adm)return adminAction(adm,id);
  if(act==='club')clubModal(db.clubs.find(c=>c.id===id));
  if(act==='event')eventModal(db.events.find(c=>c.id===id));
  if(act==='register')registerModal(id);
  if(act==='closeModal')$('#modal').close();
  if(act==='filter'){ui.filter=b.dataset.v;renderFilters();renderLists()}
});
document.addEventListener('submit',e=>{
  e.preventDefault();const f=e.target;
  if(f.id==='regForm')submitRegistration(f);
  if(f.id==='itemForm')saveItem(f);
  if(f.id==='settingsForm'){db.settings=readForm(SCHEMAS.settings.fields,f,db.settings);if(saveData()){renderAll();toast('Settings saved')}}
});
document.addEventListener('input',e=>{
  if(e.target.id==='search'){ui.q=e.target.value;$('#clearSearch').hidden=!ui.q;renderLists()}
  if(e.target.id&&e.target.id.startsWith('img-')){const p=$('#prev-'+e.target.id.slice(4));p.src=e.target.value;p.hidden=!e.target.value} // live image preview
});
document.addEventListener('change',e=>{ // uploaded file -> data URL (kept in LocalStorage, so size is limited)
  const k=e.target.dataset.file;if(!k||!e.target.files[0])return;const file=e.target.files[0];
  if(file.size>400000){toast('Image too large. Use a file under 400 KB or an image link.');e.target.value='';return}
  const r=new FileReader();r.onload=()=>{const i=$('#img-'+k);i.value=r.result;i.dispatchEvent(new Event('input',{bubbles:true}))};r.readAsDataURL(file);
});
$('#clearSearch').onclick=()=>{ui.q='';$('#search').value='';$('#clearSearch').hidden=true;renderLists();$('#search').focus()};
$('#modalClose').onclick=()=>$('#modal').close();
$('#modal').addEventListener('close',()=>document.body.classList.remove('lock')); // Escape also triggers this
$('#menuBtn').onclick=()=>{const o=$('#nav').classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',o)};
$('#nav').addEventListener('click',()=>{$('#nav').classList.remove('open');$('#menuBtn').setAttribute('aria-expanded','false')});

/* Switch between public site and admin view using the URL hash (#admin). */
function route(){
  const admin=location.hash==='#admin';
  $('#siteView').hidden=admin;$('#adminView').hidden=!admin;
  if(admin)renderAdmin();
  else{const t=$(location.hash||'#home');if(t)setTimeout(()=>t.scrollIntoView(),0)}
  if(admin)window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);
// Highlight the nav link of the section currently on screen.
const links=[...document.querySelectorAll('#nav a[href^="#"]')];
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+en.target.id))}),{rootMargin:'-40% 0px -55% 0px'});
['home','clubs','events','resources','about'].forEach(id=>io.observe($('#'+id)));
renderAll();route();
