import { PaperPage } from '../src/ui/paper-page/paper-page';
import { EncoderUi } from '../src/ui/encoder-ui/encoder-ui';
import React from 'react';
import ReactDOM from 'react-dom';

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
      <EncoderUi />
    </PaperPage>,
    document.getElementById('root') as HTMLElement,
  );
}

registerHMR();
render();
