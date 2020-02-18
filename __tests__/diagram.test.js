import cytoscape from 'cytoscape';
import Diagram from '../diagram';

jest.mock('cytoscape', () => {
  const cytoscapeMock = jest.fn();
  cytoscapeMock.api = {
    json: jest.fn(),
    ready: jest.fn(),
    fit: jest.fn(),
    on: jest.fn(),
    layout: { run: jest.fn() },
  };
  cytoscapeMock.use = jest.fn();

  return cytoscapeMock.mockReturnValue(cytoscapeMock.api);
});

afterEach(() => {
  cytoscape.api.json.mockClear();
  cytoscape.api.ready.mockClear();
  cytoscape.api.fit.mockClear();
  cytoscape.api.layout.run.mockClear();
  cytoscape.mockClear();
});

it('sets up custom cytoscape diagram layout', () => {
  new Diagram();

  expect(cytoscape.use).toHaveBeenCalled();
});

// it('initializes cytoscape instance', () => {
//   shallow(
//     <Diagram
//       data={{}}
//       selectedLevel="context"
//     />,
//   );

//   expect(cytoscape).toHaveBeenCalledWith({
//     style: expect.any(Array),
//     maxZoom: 6,
//     minZoom: 1,
//     userZoomingEnabled: true,
//     userPanningEnabled: true,
//     boxSelectionEnabled: false,
//     autounselectify: true,
//     container: null, // it's always null in test mode
//     elements: [],
//     layout: { name: 'dagre' },
//   });
// });

// it('renders diagram and fits view according right level', () => {
//   const diagram = shallow(
//     <Diagram
//       data={{}}
//       selectedLevel="context"
//     />,
//   );

//   diagram.setProps({
//     data: { context: { foo: { name: 'Foo' } } },
//   });

//   expect(cytoscape.api.json).toHaveBeenCalledWith({
//     elements: [{
//       data: {
//         id: 'foo',
//         name: 'Foo',
//         parent: undefined,
//         hasChild: false,
//         selectionId: 'context:foo',
//       },
//     }],
//   });
//   expect(cytoscape.api.ready).toHaveBeenCalledWith(expect.any(Function));
//   expect(cytoscape.api.fit).toHaveBeenCalledWith('#context');
// });

// it('renders diagram and does not fit view if selected level is not provided', () => {
//   const diagram = shallow(
//     <Diagram
//       data={{}}
//       selectedLevel={undefined}
//     />,
//   );

//   diagram.setProps({
//     data: { context: { foo: { name: 'Foo' } } },
//   });

//   expect(cytoscape.api.json).toHaveBeenCalledWith({
//     elements: [{
//       data: {
//         id: 'foo',
//         name: 'Foo',
//         parent: undefined,
//         hasChild: false,
//         selectionId: 'context:foo',
//       },
//     }],
//   });
//   expect(cytoscape.api.ready).toHaveBeenCalledWith(expect.any(Function));
//   expect(cytoscape.api.fit.mock.calls.length).toBe(0);
// });

// it('renders elements which is related', () => {
//   const diagram = shallow(
//     <Diagram
//       data={{}}
//       selectedLevel="context"
//     />,
//   );
//   const parent = undefined;

//   diagram.setProps({
//     data: {
//       context: {
//         foo: { name: 'Foo', relations: { to: { bar: 'Knows about bar' } } },
//         bar: { name: 'Bar' },
//       },
//     },
//   });

//   expect(cytoscape.api.json).toHaveBeenCalledWith({
//     elements: [
//       {
//         data: {
//           id: 'foo',
//           name: 'Foo',
//           parent,
//           hasChild: false,
//           selectionId: 'context:foo',
//         },
//       },
//       {
//         data: {
//           parent,
//           id: 'foo_bar',
//           name: 'Knows about bar',
//           source: 'foo',
//           target: 'bar',
//         },
//       },
//       {
//         data: {
//           id: 'bar',
//           name: 'Bar',
//           parent,
//           hasChild: false,
//           selectionId: 'context:bar',
//         },
//       },
//     ],
//   });
// });

// it('renders nodes with key as a name if `name` does not exist', () => {
//   const diagram = shallow(
//     <Diagram
//       data={{}}
//       selectedLevel="context"
//     />,
//   );
//   const parent = undefined;

//   diagram.setProps({
//     data: {
//       context: {
//         foo: {},
//         bar: {},
//       },
//     },
//   });

//   expect(cytoscape.api.json).toHaveBeenCalledWith({
//     elements: [
//       {
//         data: {
//           id: 'foo',
//           name: 'foo',
//           parent,
//           hasChild: false,
//           selectionId: 'context:foo',
//         },
//       },
//       {
//         data: {
//           id: 'bar',
//           name: 'bar',
//           parent,
//           hasChild: false,
//           selectionId: 'context:bar',
//         },
//       },
//     ],
//   });
// });

// it('it renders sub-levels', () => {
//   const diagram = shallow(
//     <Diagram
//       data={{}}
//       selectedLevel="context"
//     />,
//   );
//   const parent = undefined;

//   diagram.setProps({
//     data: {
//       context: {
//         foo: {
//           name: 'Foo',
//           container: {
//             foo1: {
//               name: 'Foo1',
//             },
//           },
//         },
//         bar: {
//           name: 'Bar',
//           relations: {
//             to: {
//               foo: 'Knows about foo',
//             },
//           },
//         },
//       },
//     },
//     selectedLevel: 'foo:foo1',
//   });

//   expect(cytoscape.api.json).toHaveBeenCalledWith({
//     elements: [
//       {
//         data: {
//           id: 'foo',
//           name: 'Foo',
//           parent,
//           hasChild: true,
//           selectionId: 'context:foo',
//         },
//       },
//       {
//         data: {
//           id: 'foo1',
//           name: 'Foo1',
//           parent: 'foo',
//           hasChild: false,
//           selectionId: 'context:foo:foo1',
//         },
//       },
//       {
//         data: {
//           id: 'bar',
//           name: 'Bar',
//           parent,
//           hasChild: false,
//           selectionId: 'context:bar',
//         },
//       },
//       {
//         data: {
//           id: 'bar_foo',
//           name: 'Knows about foo',
//           source: 'bar',
//           target: 'foo',
//         },
//       },
//     ],
//   });
// });