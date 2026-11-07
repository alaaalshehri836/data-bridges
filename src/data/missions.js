// Mission configuration — pure data, independent of the display language.
// Text for each mission lives in the i18n dictionaries under missions.<id>.*
// and payload.<connectionId>.

export const MISSIONS = [
  {
    id: 'm1',
    category: 'sharing',
    reward: 100,
    connections: [
      { id: 'm1c1', from: 'arrival_bot', to: 'event_cat', points: 30 },
      { id: 'm1c2', from: 'flight_bot', to: 'visitor_fox', points: 30 },
      { id: 'm1c3', from: 'flight_bot', to: 'crowd_monitor', points: 40 },
    ],
  },
  {
    id: 'm2',
    category: 'sharing',
    reward: 150,
    connections: [
      { id: 'm2c1', from: 'road_guard', to: 'crowd_monitor', points: 50 },
      { id: 'm2c2', from: 'incident_bot', to: 'expo_coordinator', points: 50 },
      { id: 'm2c3', from: 'road_guard', to: 'expo_coordinator', points: 50 },
    ],
  },
  {
    id: 'm3',
    category: 'interop',
    reward: 250,
    // The bridge itself earns nothing: data arrives but is not understood yet.
    connections: [{ id: 'm3c1', from: 'flight_bot', to: 'capacity_bot', points: 0, interop: true }],
    mapping: {
      sourceSample: { flight_id: '"XY204"', arrival: '"18:30"', passengers: '240' },
      fields: [
        { src: 'flight_id', dst: 'flight_number', value: '"XY204"', points: 50 },
        { src: 'arrival', dst: 'arrival_time', value: '"18:30"', points: 50 },
        { src: 'passengers', dst: 'expected_passengers', value: '240', points: 50 },
      ],
      // Shuffled order for the receiving-system column.
      targetOrder: ['arrival_time', 'expected_passengers', 'flight_number'],
      completionPoints: 100,
    },
  },
];

export const pairKey = (a, b) => [a, b].sort().join('|');

/** All characters that take part in any mission connection, keyed by pair. */
export const ALL_CONNECTIONS = MISSIONS.flatMap((m, mi) =>
  m.connections.map((c) => ({ ...c, missionIndex: mi, missionId: m.id, key: pairKey(c.from, c.to) }))
);

export const TOTAL_SCORE = MISSIONS.reduce((s, m) => s + m.reward, 0);
