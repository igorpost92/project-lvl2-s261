const getFullName = (parents, name) => {
  const parentsString = parents.filter(part => part !== '');
  return [...parentsString, name].join('.');
};

const valueToString = value => (value instanceof Object ? 'complex value' : `'${value}'`);

const stringify = (parents, name, valueString) => {
  const fullName = getFullName(parents, name);
  return `Property '${fullName}' ${valueString}`;
};

const statuses = {
  removed: ({ name, status }, parents) => {
    const valueString = `was ${status}`;
    return stringify(parents, name, valueString);
  },
  added: ({ name, status, newValue }, parents) => {
    const valueString = `was ${status} with value: ${valueToString(newValue)}`;
    return stringify(parents, name, valueString);
  },
  updated: (node, parents) => {
    const valueString = `was ${node.status}. From ${valueToString(node.oldValue)} to ${valueToString(node.newValue)}`;
    return stringify(parents, node.name, valueString);
  },
  nested: ({ name, children }, parents = []) => {
    const nested = children.reduce((acc, child) => {
      if (child.status === 'same') {
        return acc;
      }
      return [...acc, statuses[child.status](child, [...parents, name])];
    }, []);

    return nested.join('\n');
  },
};

export default statuses;
