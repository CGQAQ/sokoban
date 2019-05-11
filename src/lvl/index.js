/* eslint import/no-webpack-loader-syntax: off */

import { load } from '../lib/lvl_maker';
import l1 from '!raw-loader!./1.lvl';
import l2 from '!raw-loader!./2.lvl';
import l3 from '!raw-loader!./3.lvl';

const levels = [l1, l2, l3].map(l => load(l));

export default async () => ({ levels, total: levels.length });
