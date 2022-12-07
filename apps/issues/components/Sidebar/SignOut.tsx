'use client';

export function SidebarSignOut() {
  return (
    <button
      className="bg-slate-600 mx-4 p-2 rounded-md hover:bg-slate-700"
      onClick={() => console.log('sign out')}
    >
      Sign Out
    </button>
  );
}
