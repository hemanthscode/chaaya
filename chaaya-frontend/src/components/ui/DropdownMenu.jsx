import React from 'react';
import { MoreVertical } from 'lucide-react';

const DropdownMenu = ({ items }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full p-1 text-slate-400 hover:bg-slate-800"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 min-w-[140px] rounded-md border border-slate-800 bg-slate-900 py-1 text-xs shadow-soft">
          {items?.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick?.();
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-1.5 text-left text-slate-200 hover:bg-slate-800"
            >
              <span>{item.label}</span>
              {item.icon && <item.icon className="h-3.5 w-3.5 text-slate-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
