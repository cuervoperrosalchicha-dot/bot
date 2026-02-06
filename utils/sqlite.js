const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'database.sqlite');
const db = new Database(dbPath);

// helper to create table if not exists
function ensureTable(table, columns) {
  const cols = ['id INTEGER PRIMARY KEY'];
  for (const col of columns) cols.push(`${col} TEXT`);
  const sql = `CREATE TABLE IF NOT EXISTS ${table} (${cols.join(',')})`;
  db.prepare(sql).run();
}

function whereClause(filter) {
  const keys = Object.keys(filter || {});
  if (!keys.length) return { clause: '', params: {} };
  const clause = 'WHERE ' + keys.map(k => `${k} = @${k}`).join(' AND ');
  const params = {};
  for (const k of keys) params[k] = String(filter[k]);
  return { clause, params };
}

function createModel(table, columns) {
  ensureTable(table, columns);

  return class Model {
    constructor(obj = {}) {
      for (const k of columns) this[k] = obj[k];
      if (obj.id) this.id = obj.id;
    }

    static async find(filter = {}) {
      const { clause, params } = whereClause(filter);
      const rows = db.prepare(`SELECT * FROM ${table} ${clause}`).all(params);
      return rows.map(r => new Model(r));
    }

    static async findOne(filter = {}) {
      const { clause, params } = whereClause(filter);
      const row = db.prepare(`SELECT * FROM ${table} ${clause} LIMIT 1`).get(params);
      if (!row) return null;
      const doc = new Model(row);
      doc.deleteOne = async () => {
        db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(doc.id);
        return { acknowledged: true };
      };
      return doc;
    }

    static async findOneAndUpdate(filter = {}, update = {}) {
      const found = await this.findOne(filter);
      if (!found) return null;
      for (const k of Object.keys(update)) {
        found[k] = update[k];
      }
      await found.save();
      return found;
    }

    static async findOneAndDelete(filter = {}) {
      const found = await this.findOne(filter);
      if (!found) return null;
      await db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(found.id);
      return found;
    }

    async save() {
      const cols = Object.keys(this).filter(k => k !== 'id');
      if (this.id) {
        const set = cols.map(k => `${k} = @${k}`).join(', ');
        const params = {};
        for (const k of cols) params[k] = String(this[k]);
        params.id = this.id;
        db.prepare(`UPDATE ${table} SET ${set} WHERE id = @id`).run(params);
        return this;
      } else {
        const colsList = cols.join(', ');
        const valsList = cols.map(k => `@${k}`).join(', ');
        const params = {};
        for (const k of cols) params[k] = String(this[k]);
        const info = db.prepare(`INSERT INTO ${table} (${colsList}) VALUES (${valsList})`).run(params);
        this.id = info.lastInsertRowid;
        return this;
      }
    }
  };
}

module.exports = createModel;
