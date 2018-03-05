import React from 'react';
import RComponent from './base/component.jsx';

const createSource = (ctx, attrs) => {
  const source = ctx.createBufferSource();
  for (let a in attrs) {
    source[a] = attrs[a];
  }
  source.connect(ctx.destination);
  return source;
};

export default class RPlay extends RComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fetch(this.props.src)
    .then(res => res.arrayBuffer())
    .then(ab => this.context.audio.decodeAudioData(ab))
    .then(buf => createSource(this.context.audio, {
      buffer: buf,
      loop: !!this.props.loop
    }).start(0));
  }

  render() {
    if (this.context.debug) {
      return (
        <li>
          <strong>Play</strong><br/>
          <ul>
            <li>Source: <code>{this.props.src}</code></li>
            <li>Loop: <code>{this.props.loop.toString()}</code></li>
          </ul>
        </li>
      );
    }

    return null;
  }
};
