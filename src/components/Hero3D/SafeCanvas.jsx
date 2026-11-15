import React, { Component, lazy, Suspense } from "react";

const Hero3D = lazy(() => import("./Hero3D"));

// If WebGL fails (old device / blocked), fall back quietly to the CSS aurora background.
class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function SafeCanvas({ lite, active = true }) {
  return (
    <Boundary>
      <Suspense fallback={null}>
        <Hero3D lite={lite} active={active} />
      </Suspense>
    </Boundary>
  );
}
