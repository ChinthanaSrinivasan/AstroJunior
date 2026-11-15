const state = {
  name: "", age: 0, character: "female", mission: "", score: 0,
  completedStages: [false,false,false,false],
  trainingDone: new Set(), missionDone: new Set(), travelDone: new Set(),
  resources: { oxygen: 85, power: 75, food: 70, shielding: 80 },
  decisionIndex: 0, decisions: []
};

const trainingItems = [
  ["🌊","Underwater training","Practice moving carefully in a buoyancy training pool."],
  ["🛰️","Zero-gravity basics","Learn how objects move when they are weightless."],
  ["🧠","Mental training","Make calm decisions during a mission alert."],
  ["🩺","Medical check","Choose the correct first response to a crew health alert."],
  ["🧑‍🚀","Spacesuit check","Identify the equipment needed for a safe spacewalk."],
  ["🛠️","Spacecraft systems","Learn why spacecraft systems need regular checks."]
];
const missionTasks = {
  moon: ["Lunar environment & temperature","Radiation protection","Sample collection","Rover and robotics","Food management"],
  mars: ["Martian atmosphere","Radiation protection","Sample collection","Rover and robotics","Food management","Dust-storm preparation"]
};
const travelTasks = [
  ["🚀","Spacecraft control","Keep the spacecraft on its planned course."],
  ["📡","Communication","Confirm the crew's communication check."],
  ["⛽","Fuel management","Check that enough fuel is reserved for orbit insertion."],
  ["🥫","Food & supplies","Confirm the crew has enough supplies."],
  ["💪","Crew fitness","Complete the crew health and fitness check."],
  ["🪐","Orbit entry","Prepare to enter the destination orbit."]
];
const decisions = [
  {q:"Your outpost power is dropping. What should you do?",hint:"Think about how the outpost can generate reliable energy.",opts:["Deploy and clean solar panels","Turn off all life-support systems"],good:0,why:"Correct! Solar panels help restore power while life-support systems stay active.",change:{power:18}},
  {q:"The crew's food supply is getting low. What is the best plan?",hint:"A long mission needs a sustainable food supply.",opts:["Start a small controlled food-growing system","Use all remaining food immediately"],good:0,why:"Good decision! Growing some food can support a longer mission.",change:{food:18,power:-5}},
  {q:"A radiation alert is detected near the habitat. What should the crew do?",hint:"Protect people first, then check the habitat.",opts:["Move to the shielded shelter","Go outside to inspect the alert"],good:0,why:"Exactly. A shielded area reduces exposure during a radiation event.",change:{shielding:12,food:-3}},
  {q:"The oxygen system reports a problem. What is the safest response?",hint:"Life support is essential. Follow the emergency procedure.",opts:["Switch to the backup oxygen system and investigate","Ignore the warning and continue the mission"],good:0,why:"Mission success! Backup life support gives the crew time to investigate safely.",change:{oxygen:18,power:-4}}
];

function $(id){return document.getElementById(id)}
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  $(id).classList.add("active"); window.scrollTo({top:0,behavior:"smooth"});
}
function addScore(points){state.score+=points; $("totalScore").textContent=state.score+" XP";}
function updateMap(){
  state.completedStages.forEach((done,i)=>{
    const node=$("stageNode"+(i+1)); const btn=node.querySelector("button"); const status=node.querySelector(".node-status");
    node.classList.toggle("completed",done);
    if(done){node.classList.remove("locked","unlocked");status.textContent="✓ COMPLETED";btn.textContent="REPLAY →";btn.disabled=false;}
    else if(i===0 || state.completedStages[i-1]){node.classList.remove("locked");node.classList.add("unlocked");status.textContent="AVAILABLE";btn.textContent="ENTER →";btn.disabled=false;}
    else{node.classList.add("locked");node.classList.remove("unlocked");status.textContent="LOCKED";btn.textContent="LOCKED";btn.disabled=true;}
  });
  const count=state.completedStages.filter(Boolean).length;
  $("overallProgress").style.width=(count*25)+"%";
  $("totalScore").textContent=state.score+" XP";
}
function completeStage(i){state.completedStages[i]=true;updateMap();}
$("playerForm").addEventListener("submit",e=>{
  e.preventDefault();state.name=$("astronautName").value.trim();state.age=Number($("astronautAge").value);
  if(!state.name || state.age<8 || state.age>99)return;
  $("welcomeName").textContent="Hello, "+state.name+"!";
  showScreen("character");
});
document.querySelectorAll(".character-card").forEach(card=>card.addEventListener("click",()=>{
  document.querySelectorAll(".character-card").forEach(c=>c.classList.remove("selected"));card.classList.add("selected");state.character=card.dataset.character;
}));
$("characterContinue").addEventListener("click",()=>showScreen("lesson"));
$("lessonContinue").addEventListener("click",()=>{showScreen("map");updateMap();});
let briefingAction = null;
const stageLessons = {
  earth: {
    eyebrow:"STAGE 01 / EARTH TRAINING LESSON", title:"Prepare your body and mind for space",
    intro:"Before an astronaut can travel beyond Earth, they must learn how to work safely in an unfamiliar environment.",
    symbol:"🌍", subheading:"Why astronauts train on Earth",
    paragraph:"Astronauts do not begin their journey by immediately travelling into space. They first practise on Earth, where instructors can recreate some of the challenges of a mission in a controlled and safer setting. Underwater pools help astronauts rehearse careful movement because buoyancy can create a feeling similar to weightlessness. Simulations teach crew members how to respond to alarms, communicate clearly, follow checklists and make decisions under pressure. Medical preparation helps astronauts recognise and report health concerns, while equipment inspections teach them to check spacesuits and spacecraft systems before use. These activities build the physical awareness, scientific understanding, teamwork and discipline that every space mission requires.",
    objective:"Understand how simulations, safety procedures, teamwork and equipment checks prepare astronauts for the conditions and responsibilities of spaceflight.",
    task:"Complete the six Earth-training challenges. Read each question carefully and choose the safest and most scientifically appropriate response."
  },
  moon: {
    eyebrow:"STAGE 02 / LUNAR EXPEDITION LESSON", title:"Study the Moon before you explore",
    intro:"Your destination is the Moon. Learn about its environment and the problems a lunar exploration team must solve.",
    symbol:"🌕", subheading:"Science of a lunar expedition",
    paragraph:"The Moon is an airless world with very low gravity compared with Earth. Its surface experiences extreme changes in temperature between sunlight and darkness, and astronauts cannot breathe the surrounding environment. A lunar crew must therefore depend on a pressurised spacesuit and a protected habitat for oxygen, temperature control and other life-support needs. The surface also contains dust that can cling to equipment, while radiation from space makes shelter and mission planning important. Scientists study lunar rocks and soil to understand the Moon's history and learn more about how rocky worlds formed. Rovers, cameras and carefully planned sample collection help astronauts explore places that are difficult or unsafe to reach on foot.",
    objective:"Identify the Moon's environmental conditions and explain why life support, radiation protection, temperature control and careful sample collection matter.",
    task:"Complete the lunar preparation checks covering temperature, radiation safety, samples, rover operations and food supplies before travelling to the Moon."
  },
  mars: {
    eyebrow:"STAGE 02 / MARS EXPEDITION LESSON", title:"Understand the challenges of Mars",
    intro:"Your destination is Mars. Discover why exploring the Red Planet requires careful planning and reliable technology.",
    symbol:"🔴", subheading:"Science of a Mars expedition",
    paragraph:"Mars is a cold desert planet with a very thin atmosphere made mostly of carbon dioxide. The air is not suitable for humans to breathe, and the planet's surface is exposed to radiation because its atmosphere and global magnetic protection are much weaker than Earth's. Temperatures can be very low, and fine dust can be lifted into large storms that reduce visibility and cover solar panels or equipment. A crew exploring Mars would need a pressurised habitat, dependable oxygen and water systems, protected spaces for radiation events, and enough food and power for a long stay. Rovers and robotic instruments can investigate the terrain and help scientists select useful rock and soil samples while reducing unnecessary risks to astronauts.",
    objective:"Explain how the thin atmosphere, cold conditions, radiation and dust affect human exploration and outpost planning on Mars.",
    task:"Complete the Mars preparation checks covering the atmosphere, radiation safety, samples, rover operations, food supplies and dust-storm readiness."
  },
  travel: {
    eyebrow:"STAGE 03 / SPACE TRAVEL LESSON", title:"Plan a safe journey through space",
    intro:"Before leaving Earth orbit, the crew must confirm that the spacecraft and everyone aboard are ready for the journey.",
    symbol:"🚀", subheading:"How spacecraft journeys are prepared",
    paragraph:"A journey to the Moon or Mars depends on much more than switching on a rocket engine. Mission teams plan a flight path, calculate the energy and fuel needed for each manoeuvre, and monitor the spacecraft's position and speed. Navigation systems and ground-based communication help the crew and mission controllers share information and respond to unexpected conditions. Inside the spacecraft, life-support equipment must provide a safe supply of air, temperature control and other essentials. Food, water, medical supplies and crew health also need to be managed throughout the trip. Before major flight events, astronauts use checklists to confirm that important systems are working correctly. Careful preparation reduces risk and helps the spacecraft reach its destination safely.",
    objective:"Understand why navigation, communication, fuel planning, life support, supplies and crew health checks are essential during space travel.",
    task:"Complete all six spacecraft readiness checks. Each check represents an important part of preparing the crew and vehicle for arrival at the destination."
  },
  outpost: {
    eyebrow:"STAGE 04 / MISSION EXECUTION LESSON", title:"Keep your space outpost sustainable",
    intro:"You have reached your destination. Now your most important responsibility is helping the crew live and work safely.",
    symbol:"🏠", subheading:"The science of living beyond Earth",
    paragraph:"A space outpost must operate as a carefully managed life-support system. The crew needs a reliable supply of oxygen, clean water, food, electrical power and a safe place to live. Solar panels or other power systems can provide electricity, but energy must be managed so essential equipment keeps running. Food supplies need to be monitored, and growing plants in a controlled environment may support future long-duration missions. Radiation protection and emergency shelters help reduce risks from the space environment. If a warning appears, astronauts must assess the information, follow procedures and protect the crew before attempting repairs. Every decision affects the resources available to the outpost, so a successful mission depends on science, teamwork and responsible planning.",
    objective:"Recognise oxygen, power, food and radiation protection as connected resources that must be monitored to support a crew over time.",
    task:"Manage the outpost by making four safety and resource decisions. Choose actions that protect the crew while keeping essential systems operating."
  }
};
function showStageBriefing(key, action){
  const lesson=stageLessons[key]; briefingAction=action;
  $("briefingEyebrow").textContent=lesson.eyebrow;
  $("briefingTitle").textContent=lesson.title;
  $("briefingIntro").textContent=lesson.intro;
  $("briefingSymbol").textContent=lesson.symbol;
  $("briefingSubheading").textContent=lesson.subheading;
  $("briefingParagraph").textContent=lesson.paragraph;
  $("briefingObjective").textContent=lesson.objective;
  $("briefingTask").textContent=lesson.task;
  $("briefingContinue").textContent=key==="earth"?"BEGIN EARTH TRAINING →":key==="moon"||key==="mars"?"CONTINUE TO MISSION PREPARATION →":key==="travel"?"BEGIN SPACE TRAVEL →":"BEGIN OUTPOST MISSION →";
  showScreen("stageBriefing");
}
$("briefingContinue").addEventListener("click",()=>{if(briefingAction)briefingAction();});
$("briefingBack").addEventListener("click",()=>showScreen("map"));
document.querySelectorAll("[data-stage]").forEach(btn=>btn.addEventListener("click",()=>{
  const stage=Number(btn.dataset.stage);
  if(stage===1)showStageBriefing("earth",openTraining);
  if(stage===2)openMission();
  if(stage===3)showStageBriefing("travel",openTravel);
  if(stage===4)showStageBriefing("outpost",openOutpost);
}));
document.querySelectorAll("[data-back]").forEach(btn=>btn.addEventListener("click",()=>showScreen(btn.dataset.back)));

function openTraining(){
  const grid=$("trainingGrid");grid.innerHTML="";
  trainingItems.forEach((item,i)=>{
    const done=state.trainingDone.has(i);
    const card=document.createElement("article");card.className="training-card";
    card.innerHTML=`<div class="training-icon">${item[0]}</div><div><h3>${item[1]}</h3><p>${item[2]}</p><button class="small-btn ${done?"done":""}" ${done?"disabled":""}>${done?"✓ COMPLETED":"START CHALLENGE"}</button></div>`;
    card.querySelector("button").addEventListener("click",()=>runTrainingChallenge(i,card));
    grid.appendChild(card);
  });
  $("finishTraining").disabled=state.trainingDone.size<trainingItems.length;
  showScreen("training");
}
function runTrainingChallenge(i,card){
  const prompts=[
    ["In a buoyancy pool, what helps an astronaut practise moving as if weightless?","A carefully controlled underwater environment","Running on the pool floor"],
    ["In microgravity, what happens to an unsecured object?","It can float freely","It always falls straight down"],
    ["A warning alarm sounds. What should you do first?","Stay calm and follow the checklist","Press every button quickly"],
    ["A crew member feels unwell. What is the safest first step?","Report symptoms and follow medical procedures","Ignore it until the next day"],
    ["What should you check before a spacewalk?","Suit pressure, oxygen and communications","Only the suit colour"],
    ["Why do astronauts check spacecraft systems?","To find problems before they become emergencies","To make the spacecraft look new"]
  ];
  const [q,a,b]=prompts[i];const answer=prompt(q+"\n\nA. "+a+"\nB. "+b+"\n\nType A or B:");
  if(answer===null)return;
  if(answer.trim().toUpperCase()==="A"){state.trainingDone.add(i);addScore(100);card.querySelector("button").textContent="✓ COMPLETED";card.querySelector("button").classList.add("done");card.querySelector("button").disabled=true;$("finishTraining").disabled=state.trainingDone.size<trainingItems.length;alert("Correct! +100 XP");}
  else alert("Not quite. Try again! Hint: "+a);
}
$("finishTraining").addEventListener("click",()=>{completeStage(0);updateMap();showScreen("map");});

function openMission(){
  $("missionTraining").classList.add("hidden");document.querySelectorAll(".destination-card").forEach(c=>c.classList.toggle("selected",c.dataset.mission===state.mission));
  showScreen("mission");
}
document.querySelectorAll(".destination-card").forEach(card=>card.addEventListener("click",()=>{
  state.mission=card.dataset.mission;
  document.querySelectorAll(".destination-card").forEach(c=>c.classList.toggle("selected",c===card));
  showStageBriefing(state.mission,()=>{renderMissionTraining();showScreen("mission");});
}));
function renderMissionTraining(){
  const box=$("missionTraining");box.classList.remove("hidden");
  const tasks=missionTasks[state.mission];
  box.innerHTML=`<h3>${state.mission==="moon"?"🌕 Lunar":"🔴 Mars"} mission training</h3><p style="color:var(--muted);font-size:12px">Complete each preparation check to unlock space travel.</p>`+
    tasks.map((t,i)=>`<div class="mission-task"><span>${i+1}. ${t}</span><button data-task="${i}">${state.missionDone.has(state.mission+"-"+i)?"✓ DONE":"COMPLETE CHECK"}</button></div>`).join("")+
    `<div class="center-row"><button class="primary-btn" id="missionContinue" ${tasks.every((_,i)=>state.missionDone.has(state.mission+"-"+i))?"":"disabled"}>MISSION TRAINING COMPLETE →</button></div>`;
  box.querySelectorAll("[data-task]").forEach(btn=>btn.addEventListener("click",()=>{
    const i=Number(btn.dataset.task);const key=state.mission+"-"+i;
    if(!state.missionDone.has(key)){state.missionDone.add(key);addScore(75);btn.textContent="✓ DONE";btn.disabled=true;}
    const all=tasks.every((_,j)=>state.missionDone.has(state.mission+"-"+j));$("missionContinue").disabled=!all;
  }));
  $("missionContinue").addEventListener("click",()=>{completeStage(1);updateMap();openTravel();});
}

function openTravel(){
  if(!state.mission){openMission();return;}
  $("travelDestination").textContent=state.mission==="moon"?"🌕":"🔴";
  $("travelChecks").innerHTML="";
  travelTasks.forEach((t,i)=>{
    const done=state.travelDone.has(i);const card=document.createElement("div");card.className="travel-check";
    card.innerHTML=`<strong>${t[0]} ${t[1]}</strong><p>${t[2]}</p><button ${done?"disabled":""}>${done?"✓ CHECKED":"RUN CHECK"}</button>`;
    card.querySelector("button").addEventListener("click",()=>{state.travelDone.add(i);addScore(50);card.querySelector("button").textContent="✓ CHECKED";card.querySelector("button").disabled=true;$("launchMission").disabled=state.travelDone.size<travelTasks.length;});
    $("travelChecks").appendChild(card);
  });
  $("launchMission").disabled=state.travelDone.size<travelTasks.length;showScreen("travel");
}
$("launchMission").addEventListener("click",()=>{completeStage(2);updateMap();openOutpost();});

function openOutpost(){
  $("outpostTitle").textContent=state.mission==="mars"?"Keep your Mars outpost alive":"Keep your lunar outpost alive";
  $("basePlanet").textContent=state.mission==="mars"?"🔴":"🌕";
  state.decisionIndex=0;state.decisions=[];renderResources();renderDecision();showScreen("outpost");
}
function renderResources(){
  const names={oxygen:"Oxygen",power:"Power",food:"Food",shielding:"Radiation shielding"};
  const colors={oxygen:"#65dbe8",power:"#ffd27a",food:"#72dfa6",shielding:"#a994ff"};
  $("resourceGrid").innerHTML=Object.keys(state.resources).map(k=>`<div class="resource-card"><div class="resource-top"><span>${names[k]}</span><span class="resource-value">${state.resources[k]}%</span></div><div class="resource-bar"><span style="width:${state.resources[k]}%;background:${colors[k]}"></span></div></div>`).join("");
}
function renderDecision(){
  const d=decisions[state.decisionIndex];
  if(!d){finishMission();return;}
  $("decisionCount").textContent=`DECISION ${state.decisionIndex+1} / ${decisions.length}`;
  $("decisionQuestion").textContent=d.q;$("decisionHint").textContent=d.hint;$("decisionFeedback").textContent="";
  $("decisionOptions").innerHTML=d.opts.map((o,i)=>`<button class="decision-option" data-choice="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join("");
  $("decisionOptions").querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>chooseDecision(Number(btn.dataset.choice))));
}
function chooseDecision(choice){
  const d=decisions[state.decisionIndex];const correct=choice===d.good;
  document.querySelectorAll(".decision-option").forEach(b=>b.disabled=true);
  if(correct){Object.entries(d.change).forEach(([k,v])=>state.resources[k]=Math.max(0,Math.min(100,state.resources[k]+v)));addScore(150);$("decisionFeedback").textContent="✓ "+d.why;}
  else{state.resources.oxygen=Math.max(0,state.resources.oxygen-8);state.resources.food=Math.max(0,state.resources.food-5);$("decisionFeedback").textContent="⚠ That choice used extra supplies. "+d.why;}
  renderResources();
  const next=document.createElement("button");next.className="small-btn";next.textContent="NEXT DECISION →";next.style.marginTop="10px";next.onclick=()=>{state.decisionIndex++;renderDecision();};$("decisionFeedback").appendChild(document.createElement("br"));$("decisionFeedback").appendChild(next);
}
function finishMission(){
  completeStage(3);updateMap();
  $("completeName").textContent=state.name+"!";
  $("completeMessage").textContent=`You completed the ${state.mission==="mars"?"Mars":"Moon"} exploration mission and made important decisions to support your outpost.`;
  $("certificateName").textContent=state.name.toUpperCase();
  $("certificateMission").textContent=state.mission==="mars"?"MARTIAN EXPEDITION":"LUNAR EXPEDITION";
  $("certificateScore").textContent=state.score+" XP";
  showScreen("complete");
}
$("downloadCertificate").addEventListener("click",()=>{
  const name=state.name.replace(/[<>&"]/g,"");const mission=state.mission==="mars"?"MARTIAN EXPEDITION":"LUNAR EXPEDITION";
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Mission Certificate</title><style>body{font-family:Arial;background:#e8eef2;padding:35px}.cert{max-width:760px;margin:30px auto;background:#fffdf1;border:12px double #9aafc2;text-align:center;padding:55px 30px;color:#17314d}.title{font-size:30px;font-weight:bold;letter-spacing:3px}.name{font-size:34px;color:#315d86;margin:35px}.small{letter-spacing:3px;color:#667c91}</style></head><body><div class="cert"><div>✦ ✧ ✦</div><p class="title">JUNIOR ASTRONAUT</p><p class="small">MISSION COMPLETION CERTIFICATE</p><div class="name">${name}</div><p>has successfully completed the</p><h2>${mission}</h2><p>ASTROQUEST ACADEMY · ${state.score} XP</p></div><script>window.print()<\/script></body></html>`;
  const blob=new Blob([html],{type:"text/html"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="junior-astronaut-certificate.html";a.click();URL.revokeObjectURL(url);
});
$("playAgain").addEventListener("click",()=>location.reload());
$("soundToggle").addEventListener("click",e=>{e.currentTarget.textContent=e.currentTarget.textContent.includes("Off")?"♫ Sound: On":"♫ Sound: Off";});
updateMap();
