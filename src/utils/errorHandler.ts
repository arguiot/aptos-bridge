import {uiStore} from '../stores/uiStore';

export function unhandledrejection(e: unknown) {
  const any = e as any;
  if (any?.reason?.message === '{"message":"Generic Error"}') {
    uiStore.rpcErrorAlert.open();
  }
}

export function registerErrorHandler() {
  if (typeof window === 'undefined') return;
  window.addEventListener('unhandledrejection', unhandledrejection);
  return () => {
    window.removeEventListener('unhandledrejection', unhandledrejection);
  };
}
