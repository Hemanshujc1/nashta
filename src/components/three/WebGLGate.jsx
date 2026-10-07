import React, { useState } from 'react';
import { useWebGLSlot } from '../../lib/webgl';

// Mounts its children (a WebGL scene) only while this stage owns the page's single WebGL slot.
export default function WebGLGate({ children, className = 'absolute inset-0' }) {
  const [el, setEl] = useState(null);
  const active = useWebGLSlot(el);
  return (
    <div ref={setEl} className={className}>
      {active && children}
    </div>
  );
}
