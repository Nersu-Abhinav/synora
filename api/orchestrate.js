import { Agent } from '@strands-agents/sdk';

const specialists = [
  {name:'research', description:'Researches context, evidence, constraints and useful sources.'},
  {name:'strategy', description:'Decomposes goals into an executable plan and milestones.'},
  {name:'builder', description:'Designs implementation details and produces artifacts.'},
  {name:'executor', description:'Coordinates operational actions and dependencies.'},
  {name:'analyst', description:'Evaluates quality, risk, completeness and measurable outcomes.'}
];

function demo(goal){
  return {mode:'demo',goal,workflow:[
    {agent:'ORCHESTRATOR',status:'complete',detail:'Mission decomposed into coordinated workstreams.'},
    ...specialists.map((a,i)=>({agent:a.name.toUpperCase(),status:'complete',detail:a.description})),
    {agent:'VERIFIER',status:'complete',detail:'Outcome checked against the requested objective.'}
  ],outcome:`SYNORA produced a coordinated execution plan for: ${goal}`};
}

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'POST required'});
  const goal=String(req.body?.goal||'').trim();
  if(!goal) return res.status(400).json({error:'goal is required'});
  const hasAws=process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION;
  if(!hasAws) return res.status(200).json(demo(goal));
  try{
    const tools=specialists.map(a=>new Agent({name:a.name,systemPrompt:a.description}));
    const orchestrator=new Agent({name:'synora-orchestrator',systemPrompt:'You are SYNORA mission control. Decompose the user goal, delegate to specialists, reconcile their work, and return a concise verified outcome.',tools});
    const response=await orchestrator.invoke(goal);
    return res.status(200).json({mode:'live',goal,result:String(response)});
  }catch(error){
    return res.status(200).json({...demo(goal),fallback:true,error:String(error?.message||error)});
  }
}
