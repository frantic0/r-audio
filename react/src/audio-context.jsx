import React from 'react';
import PropTypes from 'prop-types';
import RComponent from './base/component.jsx';

/**
 * Contains and manages the Web Audio graph.
 * All immediate children connect directly to its Destination.
 *
 * @class      RAudioContext (name)
 */
export default class RAudioContext extends React.Component {
  constructor(props) {
    super(props);
    // repository of all nodes in the graph
    // keyed by Symbols
    this.nodes = new Map();
    this._context = new AudioContext();
  }

  componentWillMount() {
    this._context.resume();
  }

  getChildContext() {
    return {
      audio: this._context,
      debug: this.props.debug,
      nodes: this.nodes
    };
  }

  componentWillUnmount() {
    this._context.suspend();
  }

  render() {
    const children = React.Children
      .toArray(this.props.children)
      .map(child => {
        if (!RComponent.isPrototypeOf(child.type)) return child;

        const audioContextProps = {
          destination: () => this._context.destination,
          identifier: Symbol()
        };

        return React.cloneElement(child, audioContextProps);
      });

    if (this.props.debug) {
      return (
        <div>
          <strong>RAudioContext</strong>
          <ul>
          {children}
          </ul>
        </div>
      );
    }

    return this.props.children;
  }
};

RAudioContext.childContextTypes = {
  audio: PropTypes.instanceOf(AudioContext),
  nodes: PropTypes.instanceOf(Map),
  debug: PropTypes.bool
};
