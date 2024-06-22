import {State} from '@/utils/State';
import {toast} from 'react-toastify';

export const toastResponse = <T extends string>(
  t: Function,
  state: State<T>
) => {
  if (state.error) {
    toast.error(t(state.error.message, state.error.params));
  } else if (state.success) {
    toast.success(t(state.success.message, state.success.params));
  }
};
