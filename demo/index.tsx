import React from 'preact/compat';
import ReactDOM from 'preact/compat';

function registerHMR() {
  type ModuleHMR = typeof module & {
    hot?: {
      accept(dependencies: string | string[], callback: (updatedDependencies: any[]) => void): void;
      accept(callback: (updatedDependencies: any[]) => void): void;
    };
  };

  if ((module as ModuleHMR).hot) {
    (module as ModuleHMR).hot!.accept(render);
  }
}

function render() {
  ReactDOM.render(
    <h1>TODO</h1>,
    document.getElementById('root') as HTMLElement,
  );
}

registerHMR();
render();
