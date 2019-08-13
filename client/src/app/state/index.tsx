import WithSessionService from 'services/session';
import { CategoriesStateProvider } from 'components/tracker/categories/state';

export { useSessionState } from 'services/session/state';
export { setAccountInfo, setAccountStatus } from 'services/session/actions';

export const GlobalStateProvider = (WrappedComponent: React.FunctionComponent) => WithSessionService(CategoriesStateProvider(WrappedComponent))