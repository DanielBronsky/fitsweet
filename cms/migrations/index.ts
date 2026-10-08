import * as migration_20260929_160422_initial from './20260929_160422_initial';
import * as migration_20260930_144232_remove_seo_indexing from './20260930_144232_remove_seo_indexing';
import * as migration_20261005_185015_image_field_crops from './20261005_185015_image_field_crops';
import * as migration_20261005_190912_bilingual_fields from './20261005_190912_bilingual_fields';
import * as migration_20261005_191636_header from './20261005_191636_header';
import * as migration_20261005_192825_fonts from './20261005_192825_fonts';
import * as migration_20261005_194020_font_weights from './20261005_194020_font_weights';
import * as migration_20261008_091014_hero from './20261008_091014_hero';
import * as migration_20261008_092204_media_rotate from './20261008_092204_media_rotate';

export const migrations = [
  {
    up: migration_20260929_160422_initial.up,
    down: migration_20260929_160422_initial.down,
    name: '20260929_160422_initial',
  },
  {
    up: migration_20260930_144232_remove_seo_indexing.up,
    down: migration_20260930_144232_remove_seo_indexing.down,
    name: '20260930_144232_remove_seo_indexing',
  },
  {
    up: migration_20261005_185015_image_field_crops.up,
    down: migration_20261005_185015_image_field_crops.down,
    name: '20261005_185015_image_field_crops',
  },
  {
    up: migration_20261005_190912_bilingual_fields.up,
    down: migration_20261005_190912_bilingual_fields.down,
    name: '20261005_190912_bilingual_fields',
  },
  {
    up: migration_20261005_191636_header.up,
    down: migration_20261005_191636_header.down,
    name: '20261005_191636_header',
  },
  {
    up: migration_20261005_192825_fonts.up,
    down: migration_20261005_192825_fonts.down,
    name: '20261005_192825_fonts',
  },
  {
    up: migration_20261005_194020_font_weights.up,
    down: migration_20261005_194020_font_weights.down,
    name: '20261005_194020_font_weights',
  },
  {
    up: migration_20261008_091014_hero.up,
    down: migration_20261008_091014_hero.down,
    name: '20261008_091014_hero',
  },
  {
    up: migration_20261008_092204_media_rotate.up,
    down: migration_20261008_092204_media_rotate.down,
    name: '20261008_092204_media_rotate'
  },
];
