# kyrenia-traffic-flow-sim
Traffic simulation software for modelling effects of lane closures on traffic flow and safety in Kyrenia, TRNC. Models congestion, travel times and accident probability.

## Stack
- Simulation: HTML5 Canvas + JavaScript (IDM physics)
- Road network: `data/kyrenia_road_network.json` (real GPS coordinates)

## Run
Open `sim/kyrenia_sim.html` in any browser. No server needed.

## Regenerate road network
```bash
python generate_network.py
```