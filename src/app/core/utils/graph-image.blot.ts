import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed') as any;

export class GraphImageBlot extends BlockEmbed {
  static blotName = 'graphImage';
  static tagName = 'img';

  static create(value: any) {
    const node = super.create() as HTMLImageElement;
    node.setAttribute('src', value.src);
    node.setAttribute('alt', value.alt || '');
    node.style.maxWidth = '100%';
    node.style.display = 'block';
    node.style.margin = '10px 0';
    return node;
  }

  static value(node: HTMLImageElement) {
    return {
      src: node.getAttribute('src'),
      alt: node.getAttribute('alt')
    };
  }
}

Quill.register(GraphImageBlot);
