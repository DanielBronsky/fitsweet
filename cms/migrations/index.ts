import * as migration_20260929_160422_initial from './20260929_160422_initial';
import * as migration_20260930_144232_remove_seo_indexing from './20260930_144232_remove_seo_indexing';

export const migrations = [
  {
    up: migration_20260929_160422_initial.up,
    down: migration_20260929_160422_initial.down,
    name: '20260929_160422_initial',
  },
  {
    up: migration_20260930_144232_remove_seo_indexing.up,
    down: migration_20260930_144232_remove_seo_indexing.down,
    name: '20260930_144232_remove_seo_indexing'
  },
];
