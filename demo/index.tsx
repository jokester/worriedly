import React from 'preact/compat';
import ReactDOM from 'preact/compat';
import { PaperPage } from '../src/ui/paper-page/paper-page';
import { PaperUI } from '../src/ui/paper-ui/paper-ui';

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
    <PaperPage>
      <PaperUI />
    </PaperPage>,
    document.getElementById('root') as HTMLElement,
  );
}

registerHMR();
render();
