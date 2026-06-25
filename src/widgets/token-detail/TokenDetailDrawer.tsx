import { Drawer, DrawerContent } from '@/components/ui/drawer';
import type { GrammarNote, Token } from '@/entities/content';
import { TokenDetail } from './TokenDetail';

interface TokenDetailDrawerProps {
  open: boolean;
  token: Token | null;
  note: GrammarNote | null;
  onClose: () => void;
}

export function TokenDetailDrawer({ open, token, note, onClose }: TokenDetailDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="p-0">
        <div className="max-h-[70vh] overflow-y-auto px-4 pb-6 pt-2">
          {token && <TokenDetail token={token} note={note} />}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
