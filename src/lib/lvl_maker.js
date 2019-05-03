// load and generate lvl file content

export function load(source) {
  let unit,
    width,
    height,
    data = [];

  if (!source || !source.includes("@") || !source.includes("#")) {
    // not a valid lvl format string
    return null;
  }

  source.split("\n").forEach(line => {
    if (line.startsWith("#")) {
      console.log(`${line}`);
    } else if (line.startsWith("@")) {
      [unit, width, height] = line.split(" ").splice(1, 3);
    } else {
      data.push(line.split(" ").map(a => parseInt(a)));
    }
  });

  return { unit, width, height, data };
}

export function generate(unit, width, height, data) {
  let str = "# Generate by Level generator v1, written by CG\n";
  str += "# Github repo: https://github.com/CGQAQ/Sokoban\n";
  str += `@ ${unit} ${width} ${height}\n`;
  for (let i of data) {
    for (let j of i) {
      str += `${j} `;
    }
    str = str.trim();
    str += "\n";
  }
  return str.slice(0, -1);
}
