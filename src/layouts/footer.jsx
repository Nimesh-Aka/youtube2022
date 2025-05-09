/*export const Footer = () => {
    return (
        <footer className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <p className="text-base font-medium text-slate-900 dark:text-slate-50">© 2025 XD Code All Rights Reserved</p>
            <div className="flex flex-wrap gap-x-2">
                <a
                    href="#"
                    className="link"x
                >
                    Privacy Policy
                </a>
                <a
                    href="#"
                    className="link"
                >
                    Terms of Service
                </a>
            </div>
        </footer>
    );
};*/


import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-300 p-3 dark:border-slate-700">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          © 2024 BusFinder. All rights reserved.
        </p>
        <a
          href="#"
          className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
          // Remove any x={true} or similar boolean attributes
          onClick={(e) => e.preventDefault()}
        >
          Terms of Service
        </a>
      </div>
    </footer>
  );
};
