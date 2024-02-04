import {getNetwork} from '@layerzerolabs/ui-core';
import {ListItem, NetworkIcon, NetworkSelectOption, styled} from '@layerzerolabs/ui-kit';

export const NetworkSelectListItem: React.FC<{
  option: NetworkSelectOption;
}> = ({option, ...props}) => {
  const {chainId, overlay} = option;
  const network = getNetwork(chainId);
  return (
    <ListItem
      disabled={option.disabled}
      overlay={overlay && <Overlay>{overlay}</Overlay>}
      startAdornment={<NetworkIcon chainId={chainId} size={32} />}
      topLeft={network.name}
      bottomLeft={network.symbol}
      {...props}
    />
  );
};

const Overlay = styled('div')({
  width: '40%',
  textAlign: 'right',
});
