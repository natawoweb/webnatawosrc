
import React from 'react';
import { Slider } from '@/components/ui/slider';

export interface ImageComponentState {
  width: number;
  height: number | 'auto';
}

interface ImageComponentProps {
  contentState: any;
  block: any;
  blockProps: {
    onResizeImage: (width: number) => void;
  };
}

export const ImageComponent = ({ contentState, block, blockProps }: ImageComponentProps) => {
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src } = entity.getData();
  const blockKey = block.getKey();

  return (
    <div className="relative my-4">
      <img 
        src={src} 
        alt="Blog content" 
        style={{ width: entity.getData().width, height: entity.getData().height }}
        className="max-w-full object-contain"
      />
      <div className="mt-2 w-64">
        <Slider
          defaultValue={[entity.getData().width]}
          max={800}
          min={100}
          step={10}
          onValueChange={(value) => blockProps.onResizeImage(value[0])}
        />
      </div>
    </div>
  );
};
