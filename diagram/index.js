import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import style from './styles';

cytoscape.use(dagre);

class DiagramVisualizer {
  constructor(levels, getSuitableLevelKey, { containerId, onClick, ...config }) {
    this.levels = levels;
    this.getSuitableLevelKey = getSuitableLevelKey;
    this.layout = { name: 'dagre' };
    this.cy = cytoscape({
      style,
      maxZoom: 6,
      minZoom: 1,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      autounselectify: true,
      container: document.getElementById(containerId),
      elements: [],
      layout: this.layout,
      ...config,
    });

    this.cy.on('click', 'node', onClick);
  }

  update(elements) {
    this.cy.json({ elements });
    this.cy.ready(() => this.cy.layout(this.layout).run());
  }

  fitViewport(selectedLevel) {
    if (selectedLevel) {
      this.cy.fit(`#${selectedLevel}`);
    }
  }

  computeElements(context = {}, parent, level = 0, selectedPath, selectionPath = this.levels[0]) {
    const keys = Object.keys(context);

    return keys
      .reduce((acc, key) => {
        let groups = [];
        const { relations: { to: targetsSource } = {} } = context[key];
        const validEdge = targetsSource && Object.keys(targetsSource).some((t) => keys.includes(t));
        const node = context[key];
        const name = node.name || key;
        const selectionId = `${selectionPath}:${key}`;
        const nodeContextKey = this.getSuitableLevelKey(node, level + 1);
        const visibleNode = selectedPath.includes(key);
        const hasChild = Boolean(nodeContextKey);

        if (hasChild && visibleNode) {
          groups = this.computeElements(node[nodeContextKey], key, level + 1, selectionId);
        }

        return acc
          .concat({
            data: {
              name,
              parent,
              hasChild,
              selectionId,
              id: key,
            },
          })
          .concat(
            validEdge ? Object.keys(targetsSource).map((target) => ({
              data: {
                target,
                id: `${key}_${target}`,
                source: key,
                name: targetsSource[target],
              },
            })) : [],
          )
          .concat(groups);
      }, []);
  }
}

export default DiagramVisualizer;
