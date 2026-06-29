import i18n from '@/shared/config/i18n';
import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('UI err', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-dvh place-items-center p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <p className="font-semibold text-heading">
              {i18n.t('common.errorTitle', { defaultValue: 'Что-то пошло не так' })}
            </p>
            <p className="text-sm text-muted-foreground">
              {i18n.t('common.errorDescription', {
                defaultValue: 'Попробуйте перезагрузить страницу',
              })}
            </p>
            <Button onClick={() => window.location.reload()}>
              {i18n.t('common.reloads', { defaultValue: 'Перезагрузить' })}
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
