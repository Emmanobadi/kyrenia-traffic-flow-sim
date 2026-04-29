#!/usr/bin/env python3
"""
Kyrenia Harbor District - Bellapais Avenue & Harbor Road intersection.
Fully structured for vehicle simulation with individual lane-based roads.
"""

import json
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def create_kyrenia_harbor_intersection():
    """
    Real Kyrenia Harbor intersection:
    - Primary: Bellapais Avenue (N-S) - 2 lanes each direction  
    - Secondary: Harbor Road (E-W) - 1 lane each direction
    
    Each road segment = 1 vehicle lane (vehicles follow exact paths)
    """
    
    # Real Kyrenia Harbor coordinates
    center_lat, center_lon = 35.3360, 33.3180
    
    # Dimensions in degrees
    road_length = 400 / 111000      # ~400m approach roads
    lane_offset = 12 / 111000       # ~12m lane width
    stop_dist = 40 / 111000         # ~40m before intersection
    
    nodes = {}
    
    # ===== NORTH APPROACH (Bellapais Ave incoming) =====
    nodes['n_l_start'] = {'lat': center_lat + road_length, 'lon': center_lon - lane_offset}
    nodes['n_l_stop'] = {'lat': center_lat + stop_dist, 'lon': center_lon - lane_offset}
    nodes['n_r_start'] = {'lat': center_lat + road_length, 'lon': center_lon + lane_offset}
    nodes['n_r_stop'] = {'lat': center_lat + stop_dist, 'lon': center_lon + lane_offset}
    
    # ===== SOUTH APPROACH (Bellapais Ave incoming) =====
    nodes['s_l_start'] = {'lat': center_lat - road_length, 'lon': center_lon - lane_offset}
    nodes['s_l_stop'] = {'lat': center_lat - stop_dist, 'lon': center_lon - lane_offset}
    nodes['s_r_start'] = {'lat': center_lat - road_length, 'lon': center_lon + lane_offset}
    nodes['s_r_stop'] = {'lat': center_lat - stop_dist, 'lon': center_lon + lane_offset}
    
    # ===== EAST APPROACH (Harbor Road incoming) =====
    nodes['e_start'] = {'lat': center_lat, 'lon': center_lon + road_length}
    nodes['e_stop'] = {'lat': center_lat, 'lon': center_lon + stop_dist}
    
    # ===== WEST APPROACH (Harbor Road incoming) =====
    nodes['w_start'] = {'lat': center_lat, 'lon': center_lon - road_length}
    nodes['w_stop'] = {'lat': center_lat, 'lon': center_lon - stop_dist}
    
    # ===== INTERSECTION CROSSING POINTS =====
    nodes['int_n'] = {'lat': center_lat + stop_dist/2, 'lon': center_lon}
    nodes['int_s'] = {'lat': center_lat - stop_dist/2, 'lon': center_lon}
    nodes['int_e'] = {'lat': center_lat, 'lon': center_lon + stop_dist/2}
    nodes['int_w'] = {'lat': center_lat, 'lon': center_lon - stop_dist/2}
    
    roads = []
    road_id = 0
    
    def add_road(from_id, to_id, road_type, speed, name=''):
        nonlocal road_id
        roads.append({
            'id': f'r_{road_id}',
            'from': from_id,
            'to': to_id,
            'points': [nodes[from_id], nodes[to_id]],
            'highway': road_type,
            'speed_kmh': speed,
            'lanes': 1,
            'length': 100,
            'name': name,
            'is_approach': True if 'stop' in to_id else False
        })
        road_id += 1
    
    # ===== APPROACH ROADS =====
    add_road('n_l_start', 'n_l_stop', 'primary', 60, 'Bellapais Ave North L')
    add_road('n_r_start', 'n_r_stop', 'primary', 60, 'Bellapais Ave North R')
    add_road('s_l_start', 's_l_stop', 'primary', 60, 'Bellapais Ave South L')
    add_road('s_r_start', 's_r_stop', 'primary', 60, 'Bellapais Ave South R')
    add_road('e_start', 'e_stop', 'secondary', 50, 'Harbor Road East')
    add_road('w_start', 'w_stop', 'secondary', 50, 'Harbor Road West')
    
    # ===== INTERSECTION CROSSING ROADS =====
    # North-South straight
    add_road('n_l_stop', 's_l_stop', 'tertiary', 40, 'N-S Left Lane')
    add_road('n_r_stop', 's_r_stop', 'tertiary', 40, 'N-S Right Lane')
    add_road('s_l_stop', 'n_l_stop', 'tertiary', 40, 'S-N Left Lane')
    add_road('s_r_stop', 'n_r_stop', 'tertiary', 40, 'S-N Right Lane')
    
    # East-West straight
    add_road('e_stop', 'w_stop', 'tertiary', 40, 'E-W Road')
    add_road('w_stop', 'e_stop', 'tertiary', 40, 'W-E Road')
    
    # ===== TURNING ROADS =====
    # Right turns (clockwise)
    add_road('n_r_stop', 'e_stop', 'tertiary', 30, 'N→E Turn')
    add_road('e_stop', 's_r_stop', 'tertiary', 30, 'E→S Turn')
    add_road('s_r_stop', 'w_stop', 'tertiary', 30, 'S→W Turn')
    add_road('w_stop', 'n_r_stop', 'tertiary', 30, 'W→N Turn')
    
    # Left turns (counter-clockwise)
    add_road('n_l_stop', 'w_stop', 'tertiary', 30, 'N→W Turn')
    add_road('w_stop', 's_l_stop', 'tertiary', 30, 'W→S Turn')
    add_road('s_l_stop', 'e_stop', 'tertiary', 30, 'S→E Turn')
    add_road('e_stop', 'n_l_stop', 'tertiary', 30, 'E→N Turn')
    
    # ===== EXIT ROADS =====
    add_road('n_l_stop', 'n_l_start', 'primary', 60, 'Bellapais Ave North Exit L')
    add_road('n_r_stop', 'n_r_start', 'primary', 60, 'Bellapais Ave North Exit R')
    add_road('s_l_stop', 's_l_start', 'primary', 60, 'Bellapais Ave South Exit L')
    add_road('s_r_stop', 's_r_start', 'primary', 60, 'Bellapais Ave South Exit R')
    add_road('e_stop', 'e_start', 'secondary', 50, 'Harbor Road East Exit')
    add_road('w_stop', 'w_start', 'secondary', 50, 'Harbor Road West Exit')
    
    lats = [n['lat'] for n in nodes.values()]
    lons = [n['lon'] for n in nodes.values()]
    
    return {
        'center': {'lat': center_lat, 'lon': center_lon},
        'bounds': {
            'north': max(lats),
            'south': min(lats),
            'east': max(lons),
            'west': min(lons)
        },
        'nodes': nodes,
        'roads': roads,
        'area': 'Kyrenia Harbor District',
        'location': 'Bellapais Avenue & Harbor Road',
        'description': 'Small realistic intersection - fully structured for vehicle simulation',
        'ready_for_vehicles': True,
        'approach_roads': [r['id'] for r in roads if r.get('is_approach')]
    }

def save_network(data):
    """Save network to JSON."""
    output_path = 'kyrenia_road_network.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f'✅ Created: {output_path}')
    print(f'   Area: {data["area"]}')
    print(f'   Location: {data["location"]}')
    print(f'   Nodes: {len(data["nodes"])}')
    print(f'   Roads (lanes): {len(data["roads"])}')
    print(f'   Ready for vehicles: {data["ready_for_vehicles"]}')
    return output_path

if __name__ == '__main__':
    print('🔄 Creating Kyrenia Harbor intersection (vehicle-ready)...')
    data = create_kyrenia_harbor_intersection()
    save_network(data)
    print('[OK] Intersection ready - vehicles can now navigate this network')
