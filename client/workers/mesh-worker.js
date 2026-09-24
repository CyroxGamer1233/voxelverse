self.onmessage=e=>{const {blocks=[]}=e.data;self.postMessage({vertices:blocks.length*24,indices:blocks.length*36})};
