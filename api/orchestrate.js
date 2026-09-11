const specialists = [
  ['RESEARCH','Discovery & intelligence','Finds context, evidence, constraints and useful information.'],
  ['STRATEGIST','Planning & decomposition','Turns intent into milestones, priorities and acceptance criteria.'],
  ['BUILDER','Implementation','Designs concrete artifacts, code and implementation details.'],
  ['EXECUTOR','Action runner','Sequences operational steps and dependencies.'],
  ['ANALYST','Evaluation & insight','Checks quality, risks, completeness and measurable outcomes.']
]
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n))
const words=s=>String(s).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
const unique=a=>[...new Set(a)]
function deriveMission(goal){
 const w=words(goal),text=goal.trim(),complexity=clamp(Math.ceil(text.length/55)+w.length/12,1,8)
 const has=(...xs)=>xs.some(x=>w.includes(x)),tasks=[]
 if(has('research','analyze','analyse','study','investigate','compare','market','competitor'))tasks.push(['RESEARCH','Scope the problem, gather relevant evidence, and identify constraints.'])
 if(has('plan','strategy','strategic','roadmap','launch','design','build','create','develop'))tasks.push(['STRATEGIST','Decompose the requested outcome into ordered milestones and success criteria.'])
 if(has('build','create','develop','code','implement','prototype','website','app','model'))tasks.push(['BUILDER','Translate the plan into concrete artifacts, implementation decisions and validation checks.'])
 if(has('deploy','execute','automate','send','publish','run','setup','set','integrate'))tasks.push(['EXECUTOR','Prepare the operational sequence, dependencies and completion conditions.'])
 tasks.push(['ANALYST','Evaluate the proposed outcome for quality, risk, gaps and measurable completion.'])
 return{complexity,tasks:unique(tasks.map(x=>x[0])).map(k=>tasks.find(x=>x[0]===k))}
}
function demo(goal){
 const m=deriveMission(goal),selected=m.tasks.length?m.tasks:[['STRATEGIST','Convert the intent into an executable mission plan.']]
 const workflow=[{agent:'ORCHESTRATOR',status:'complete',detail:`Accepted mission and decomposed a ${m.complexity}-level request into ${selected.length} workstreams.`},...selected.map(([agent,detail])=>({agent,status:'complete',detail})),{agent:'VERIFIER',status:'complete',detail:'Cross-checked the requested outcome against the generated plan and completion criteria.'}]
 const deliverables=selected.map(([a])=>a==='RESEARCH'?'Evidence brief & findings':a==='STRATEGIST'?'Prioritized execution plan':a==='BUILDER'?'Implementation blueprint':a==='EXECUTOR'?'Operational runbook':'Quality & risk assessment')
 return{mode:'demo',goal,summary:`SYNORA converted “${goal}” into a coordinated ${m.complexity}-level mission and routed the relevant specialist workstreams.`,workflow,plan:selected.map(([agent,detail],i)=>({step:i+1,agent,title:detail.replace(/\.$/,''),status:'ready'})),deliverables,risks:m.complexity>5?['External facts may require live sources.','Execution actions require explicit integrations and permissions.']:['Validate assumptions against the target environment before acting.'],nextActions:['Review the generated plan and adjust constraints if needed.','Connect live tools or AWS credentials for real-world execution.','Approve the mission before external actions are performed.'],metrics:{complexity:m.complexity,agents:workflow.length-1,workstreams:selected.length,verification:'passed'},outcome:`Mission plan ready: ${goal}`}
}
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'POST required'})
 const goal=String(req.body?.goal||'').trim();if(!goal)return res.status(400).json({error:'goal is required'})
 const hasAws=Boolean(process.env.AWS_ACCESS_KEY_ID&&process.env.AWS_SECRET_ACCESS_KEY&&process.env.AWS_REGION)
 if(!hasAws)return res.status(200).json(demo(goal))
 try{
  const {Agent}=await import('@strands-agents/sdk')
  const tools=specialists.map(([name,description])=>new Agent({name:name.toLowerCase(),description,systemPrompt:`You are the ${name} specialist in SYNORA. ${description} Return concise, actionable work for the parent orchestrator.`,printer:false}))
  const orchestrator=new Agent({name:'synora-orchestrator',description:'SYNORA mission control',systemPrompt:'You are SYNORA mission control. Decompose the user goal, delegate to the most relevant specialist agents, reconcile their responses, verify completeness, and return a structured mission outcome with summary, plan, deliverables, risks and next actions.',tools,printer:false})
  const response=await orchestrator.invoke(goal)
  const result=String(response?.lastMessage?.content?.[0]?.text||response?.lastMessage?.content||response||'')
  return res.status(200).json({mode:'live',goal,result,workflow:(orchestrator.messages||[]).slice(-10).map((m,i)=>({agent:i===0?'ORCHESTRATOR':'RUNTIME',status:'complete',detail:typeof m.content==='string'?m.content:'Agent execution recorded.'})),metrics:{provider:'Amazon Bedrock',sdk:'Strands Agents SDK',verification:'runtime'}})
 }catch(error){return res.status(200).json({...demo(goal),fallback:true,error:String(error?.message||error)})}
}
