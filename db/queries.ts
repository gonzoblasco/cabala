import { getDatabase } from './schema';

export interface Entry {
  id: string;
  photo_path: string;
  title: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  audio_path: string | null;
  is_incognito: number;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export async function getAllEntries(): Promise<Entry[]> {
  const db = await getDatabase();
  const entries = await db.getAllAsync<Entry>(
    'SELECT * FROM entries ORDER BY created_at DESC'
  );

  // Fetch tags for each entry
  for (const entry of entries) {
    const tags = await db.getAllAsync<{ name: string }>(
      `SELECT t.name FROM tags t
       JOIN entry_tags et ON t.id = et.tag_id
       WHERE et.entry_id = ?`,
      [entry.id]
    );
    entry.tags = tags.map((t) => t.name);
  }

  return entries;
}

export async function getEntryById(id: string): Promise<Entry | null> {
  const db = await getDatabase();
  const entry = await db.getFirstAsync<Entry>(
    'SELECT * FROM entries WHERE id = ?',
    [id]
  );

  if (!entry) return null;

  const tags = await db.getAllAsync<{ name: string }>(
    `SELECT t.name FROM tags t
     JOIN entry_tags et ON t.id = et.tag_id
     WHERE et.entry_id = ?`,
    [id]
  );
  entry.tags = tags.map((t) => t.name);

  return entry;
}

export async function createEntry(entry: Omit<Entry, 'tags'>): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO entries (id, photo_path, title, description, latitude, longitude, address, audio_path, is_incognito, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.id,
      entry.photo_path,
      entry.title,
      entry.description,
      entry.latitude,
      entry.longitude,
      entry.address,
      entry.audio_path,
      entry.is_incognito,
      entry.created_at,
      entry.updated_at,
    ]
  );
}

export async function addTagToEntry(entryId: string, tagName: string): Promise<void> {
  const db = await getDatabase();
  const tagId = crypto.randomUUID();
  const now = new Date().toISOString();

  // Insert tag if not exists
  await db.runAsync(
    `INSERT OR IGNORE INTO tags (id, name, created_at) VALUES (?, ?, ?)`,
    [tagId, tagName.toLowerCase(), now]
  );

  // Get the tag id (existing or newly created)
  const tag = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM tags WHERE name = ?',
    [tagName.toLowerCase()]
  );

  if (tag) {
    await db.runAsync(
      'INSERT OR IGNORE INTO entry_tags (entry_id, tag_id) VALUES (?, ?)',
      [entryId, tag.id]
    );
  }
}

export async function getEntriesByDate(date: string): Promise<Entry[]> {
  const db = await getDatabase();
  const startOfDay = `${date}T00:00:00.000Z`;
  const endOfDay = `${date}T23:59:59.999Z`;

  return await db.getAllAsync<Entry>(
    'SELECT * FROM entries WHERE created_at >= ? AND created_at <= ? ORDER BY created_at ASC',
    [startOfDay, endOfDay]
  );
}

export async function getEntriesByLocation(
  lat: number,
  lng: number,
  radiusKm: number = 0.5
): Promise<Entry[]> {
  const db = await getDatabase();
  // Approximate: 1 degree lat ≈ 111km, 1 degree lng ≈ 111*cos(lat) km
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  return await db.getAllAsync<Entry>(
    `SELECT * FROM entries
     WHERE latitude BETWEEN ? AND ?
     AND longitude BETWEEN ? AND ?
     AND is_incognito = 0
     ORDER BY created_at DESC`,
    [lat - latDelta, lat + latDelta, lng - lngDelta, lng + lngDelta]
  );
}
