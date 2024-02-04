import {SDK} from '@layerzerolabs/lz-aptos';
import {EXECUTOR_ADDRESS} from '@layerzerolabs/lz-aptos/dist/constants';
import {Bridge as BridgeModule} from '@layerzerolabs/lz-aptos/dist/modules/apps/bridge';
import {Coin as CoinModule} from '@layerzerolabs/lz-aptos/dist/modules/apps/coin';
import {OFT as OFTModule} from '@layerzerolabs/lz-aptos/dist/modules/apps/oft';
import {ChainId} from '@layerzerolabs/lz-sdk';
import {
  AptosManagedCoinRegisterService,
  AptosResourceProvider,
  BalanceProvider__aptos,
  DstConfigProvider__aptos,
  ResourceProvider__currency_aptos,
} from '@layerzerolabs/ui-aptos';
import {AptosBridge__aptos, AptosBridge__evm} from '@layerzerolabs/ui-bridge-aptos';
import {OftBridge__aptos, OftBridge__evm} from '@layerzerolabs/ui-bridge-oft';
import {
  CurrencyAmount,
  IconTheme,
  isEvmChainId,
  ResourceProvider__currency_evm,
  setIconTheme,
} from '@layerzerolabs/ui-core';
import {BalanceProvider__evm, ERC20__api} from '@layerzerolabs/ui-erc20-sdk';
import {
  createFailoverProvider,
  ProviderFactory,
  setProviderFactory,
} from '@layerzerolabs/ui-ethers';
import {DstConfigProvider__evm} from '@layerzerolabs/ui-lz-sdk';
import {
  airdropStore,
  approveStore,
  AptosWalletAdapter,
  balanceStore,
  EvmWalletAdapter,
  recordTransactions,
  relayerStore,
  resourceStore,
  setAptosAdapter,
  setEvmAdapter,
  transactionStore,
  walletStore,
} from '@layerzerolabs/ui-mobx';
// import {mainnet, StargateBridge__evm} from '@layerzerolabs/ui-stargate-sdk';
import {AptosClient} from 'aptos';
import assert from 'assert';
import {memoize, uniq} from 'lodash';

import {BRIDGE as BRIDGE_CONFIG} from '../config/bridge';
import {APTOS_NODE_URL, CHAIN_STAGE} from '../config/env';
import {OFT as OFT_CONFIG} from '../config/oft';
import {
  CakeExtras__aptos,
  CakeExtras__evm,
  CakeLimitApi,
  setCakeLimitApi,
} from '../hooks/useCakeLimitAmount';
import {DefaultAirdropProvider__aptos} from '../sdk/airdrop/DefaultAirdropProvider__aptos';
import {DefaultAirdropProvider__evm} from '../sdk/airdrop/DefaultAirdropProvider__evm';
import {BridgeStrategy} from '../sdk/strategy/BridgeStrategy';
import {BridgeStrategy__bridge_aptos} from '../sdk/strategy/BridgeStrategy__bridge_aptos';
import {BridgeStrategy__bridge_evm} from '../sdk/strategy/BridgeStrategy__bridge_evm';
import {BridgeStrategy__oft_aptos} from '../sdk/strategy/BridgeStrategy__oft_aptos';
import {BridgeStrategy__oft_evm} from '../sdk/strategy/BridgeStrategy__oft_evm';
// import {BridgeStrategy__stargate_evm} from '../sdk/strategy/BridgeStrategy__stargate_evm';
import {bridgeStore, initBridgeStore} from '../stores/bridgeStore';
import {configStore} from '../stores/configStore';
import {recordUiStore, uiStore} from '../stores/uiStore';
import {unclaimedStore} from '../stores/unclaimedStore';
import {registerErrorHandler} from '../utils/errorHandler';
import {mint} from '../utils/mint';

export function bootstrap(config: {
  evmAdapter: EvmWalletAdapter;
  aptosAdapter: AptosWalletAdapter;
}) {
  const aptosClient = new AptosClient(APTOS_NODE_URL);
  setAptosAdapter(config.aptosAdapter);
  setEvmAdapter(config.evmAdapter);

  // optional: set icon theme
  setIconTheme(IconTheme.LZ_DARK);
  // optional: set provider factory
  const providerFactory: ProviderFactory = memoize((chainId) => createFailoverProvider(chainId));
  setProviderFactory(providerFactory);

  const LZ_EXECUTOR_ACCOUNT = EXECUTOR_ADDRESS[CHAIN_STAGE];
  assert(LZ_EXECUTOR_ACCOUNT, 'LZ_EXECUTOR_ACCOUNT');

  const aptosSdk = new SDK({
    provider: aptosClient,
    stage: CHAIN_STAGE,
  });

  const aptosResourceProvider = new AptosResourceProvider(aptosClient);
  const aptosManagedCoinRegisterService = new AptosManagedCoinRegisterService(
    aptosClient,
    aptosResourceProvider,
  );

  const oftModule = new OFTModule(aptosSdk);
  const coinModule = new CoinModule(aptosSdk);
  const bridgeModule = new BridgeModule(aptosSdk, coinModule);

  const cakeConfig = OFT_CONFIG.find((config) =>
    config.tokens.some((token) => token.symbol.toUpperCase() === 'CAKE'),
  );
  assert(cakeConfig);
  const cakeLimitApi = new CakeLimitApi(
    cakeConfig.tokens.map((token) =>
      isEvmChainId(token.chainId)
        ? new CakeExtras__evm(token, cakeConfig, providerFactory)
        : new CakeExtras__aptos(token, aptosClient, cakeConfig, providerFactory),
    ),
  );
  setCakeLimitApi(cakeLimitApi);

  // aptos bridge api
  const aptosBridge__evm = new AptosBridge__evm(providerFactory, BRIDGE_CONFIG);
  const aptosBridge__aptos = new AptosBridge__aptos(
    aptosClient,
    bridgeModule,
    BRIDGE_CONFIG,
    aptosSdk,
    aptosManagedCoinRegisterService,
    providerFactory,
  );

  // oft api
  const oft = OFT_CONFIG.map((oftConfig) => {
    const evm = new OftBridge__evm(providerFactory, oftConfig);
    const aptos = new OftBridge__aptos(
      aptosSdk,
      oftModule,
      aptosClient,
      oftConfig,
      aptosManagedCoinRegisterService,
    );
    return {
      config: oftConfig,
      evm,
      aptos,
    };
  });

  // stargate api
  // const stargateBridge__evm = new StargateBridge__evm(providerFactory, mainnet);

  const strategies: BridgeStrategy[] = [
    // aptos bridge
    new BridgeStrategy__bridge_aptos(aptosBridge__aptos),
    new BridgeStrategy__bridge_evm(aptosBridge__evm),
    // oft
    ...oft.flatMap(({evm, aptos}) => [
      new BridgeStrategy__oft_aptos(aptos),
      new BridgeStrategy__oft_evm(evm),
    ]),
    // stargate
    // new BridgeStrategy__stargate_evm(stargateBridge__evm),
  ];

  bridgeStore.setStrategies(strategies);
  unclaimedStore.setStrategies(strategies);

  resourceStore.setProviders([
    new ResourceProvider__currency_evm(),
    new ResourceProvider__currency_aptos(aptosManagedCoinRegisterService),
  ]);

  relayerStore.setProviders([
    new DstConfigProvider__evm(providerFactory),
    new DstConfigProvider__aptos(aptosSdk, LZ_EXECUTOR_ACCOUNT),
  ]);

  balanceStore.setProviders([
    new BalanceProvider__aptos(aptosResourceProvider),
    new BalanceProvider__evm(providerFactory),
  ]);

  approveStore.setApi(new ERC20__api(providerFactory));

  airdropStore.setProviders([
    new DefaultAirdropProvider__aptos(aptosClient),
    new DefaultAirdropProvider__evm(providerFactory),
  ]);

  const currencies = [...BRIDGE_CONFIG.tokens, ...OFT_CONFIG.flatMap(({tokens}) => tokens)];
  const chains = uniq(currencies.map((token) => token.chainId));

  bridgeStore.setCurrencies(currencies);
  configStore.setChains(chains);

  if (typeof window !== 'undefined') {
    Object.assign(window, {
      mint,
      aptosBridge: {
        ui: uiStore,
        bridge: bridgeStore,
        config: configStore,
        history: transactionStore,
        wallet: walletStore,
        allowance: approveStore,
        utils: {
          ChainId,
          CurrencyAmount,
        },
      },
    });

    registerErrorHandler();
    recordTransactions();
    recordUiStore();
    initBridgeStore();

    config.aptosAdapter.eagerConnect();
  }
}
