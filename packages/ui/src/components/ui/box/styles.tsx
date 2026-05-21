import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { isWeb } from '@gluestack-ui/utils/nativewind-utils';

// Web: flex without flex-col so row layouts (flex-row) are not overridden by base flex-col
// in the compiled CSS order. Vertical stacks should pass flex-col explicitly.
const baseStyle = isWeb
  ? 'flex relative z-0 box-border border-0 list-none min-w-0 min-h-0 bg-transparent items-stretch m-0 p-0 text-decoration-none'
  : '';

export const boxStyle = tva({
  base: baseStyle,
});
