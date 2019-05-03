/* eslint import/no-webpack-loader-syntax: off */

import { load } from "../lib/lvl_maker";
import l1 from "!raw-loader!./1.lvl";
import l2 from "!raw-loader!./2.lvl";
import l3 from "!raw-loader!./3.lvl";
import l4 from "!raw-loader!./4.lvl";

export default async () => [l1, l2, l3, l4].map(l => load(l));
