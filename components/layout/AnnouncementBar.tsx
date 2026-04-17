import React from 'react';

export function AnnouncementBar({ settings }: { settings: Record<string, any> | null }) {
  const isActive = settings?.announcement_active === 'true' || settings?.announcement_active === true;
  let items: string[] = [];

  if (settings?.announcement_items) {
    try {
      const parsed = typeof settings.announcement_items === 'string' 
        ? JSON.parse(settings.announcement_items) 
        : settings.announcement_items;
      if (Array.isArray(parsed)) {
        items = parsed;
      } else if (typeof settings.announcement_items === 'string') {
        items = [settings.announcement_items];
      }
    } catch {
      items = [typeof settings.announcement_items === 'string' ? settings.announcement_items : ""];
    }
  } else if (settings?.announcement_text) {
    items = [settings.announcement_text];
  }

  if (!isActive || items.length === 0 || !items[0]) return null;

  return (
    <div className="bg-brand-600 relative overflow-hidden h-10 flex shrink-0 border-b border-brand-700">
      <div className="flex w-full items-center justify-center text-white text-sm font-medium h-full px-4 overflow-hidden relative">
        <div className="truncate max-w-full block">
          {items[0]}
        </div>
      </div>
    </div>
  );
}
