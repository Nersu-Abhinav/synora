# SYNORA — AI Workforce

SYNORA is a production-style command center for coordinated multi-agent AI workflows. It turns natural-language intent into a structured mission, routes work across specialist agents, records execution, and surfaces an auditable outcome.

## Highlights
- Mission Control command center
- Six-role AI workforce
- Workflow history persisted in the browser
- Analytics and observability dashboard
- Supervisor-style architecture view
- Settings and runtime controls
- Responsive desktop/tablet/mobile UI
- Vercel-ready serverless orchestration endpoint
- Strands Agents SDK integration point with deterministic demo fallback

## Run locally
Serve the repository with any static/serverless-capable environment. Vercel can deploy it directly from this repository.

## AWS / Strands
When `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION` are configured in the deployment environment, `/api/orchestrate` uses the Strands Agents SDK path. Without credentials it safely uses the local demo execution path so the interface remains usable.

## License
MIT
